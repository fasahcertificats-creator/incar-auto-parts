import assert from "node:assert/strict";
import test from "node:test";
import {
  clearAttempt,
  fingerprintPayload,
  getOrCreateAttempt,
  markAttemptRetryable,
  resolveAttempt,
  shouldClearDraft,
} from "../src/features/rfq/api/attempt.ts";
import { getRfqReceipt, submitProductRfq } from "../src/features/rfq/api/client.ts";
import {
  mapRfqError,
  retryDelayMilliseconds,
  RfqApiError,
} from "../src/features/rfq/api/errors.ts";
import {
  mapProductRfqPayload,
  validateProductRfqDraft,
} from "../src/features/rfq/api/mapper.ts";

const formData = {
  fullName: "Synthetic Contact",
  companyName: "Synthetic Trading",
  countryCode: "sa",
  city: "Synthetic City",
  email: "rfq-synthetic@example.test",
  whatsapp: "+0000000002",
  businessType: "wholesaler",
  interestedProductsText: "SYNTHETIC-PN-001",
  requestedQuantityText: "10",
  message: "Synthetic Sprint 0E test only",
  privacyConsent: true,
};

const selectedItem = {
  productId: "candidate-synthetic-100",
  productName: "Synthetic Brake Pad",
  slug: "synthetic-brake-pad",
  brand: "Synthetic Make",
  vehicleModel: "Synthetic Model",
  category: "Brake System",
  partNumber: "SYNTHETIC-PN-001",
  oemNumber: "SYNTHETIC-OEM-001",
  quantity: 10,
};

const payload = mapProductRfqPayload({ locale: "ar", formData, items: [selectedItem] });
const responseBody = {
  publicReference: "INCAR-RFQ-2026-01ARZ3NDEKTS",
  requestType: "product-rfq",
  requestIntent: null,
  status: "submitted",
  submittedAt: "2026-08-09T10:00:00.000Z",
};

test("maps the frontend draft to the strict public Product RFQ contract", () => {
  assert.equal(payload.requestType, "product-rfq");
  assert.equal(payload.locale, "ar");
  assert.equal(payload.marketCountryCode, "SA");
  assert.equal(payload.contact.preferredLocale, "ar");
  assert.equal(payload.items[0].productCandidateId, selectedItem.productId);
  assert.deepEqual(payload.privacyConsent, { accepted: true });
  assert.equal("status" in payload, false);
  assert.equal("submissionSource" in payload, false);
  assert.equal("referenceMatch" in payload.items[0], false);
  assert.equal("compatibilityStatus" in payload.items[0], false);
});
test("maps manual references and locale without adding a fifth request type", () => {
  const manual = mapProductRfqPayload({ locale: "en", formData, items: [] });
  assert.equal(manual.requestType, "product-rfq");
  assert.equal(manual.contact.preferredLocale, "en");
  assert.deepEqual(manual.items[0], {
    partNumber: "SYNTHETIC-PN-001",
    quantity: 10,
    unit: "pcs",
    source: "manual",
  });
});
test("validates contact, item, quantity, privacy, and compatibility before HTTP", () => {
  const invalid = {
    ...formData,
    fullName: "",
    companyName: "",
    countryCode: "Saudi Arabia",
    email: "invalid",
    interestedProductsText: "",
    requestedQuantityText: "0",
    privacyConsent: false,
  };
  const errors = validateProductRfqDraft({ locale: "ar", formData: invalid, items: [] });
  assert.deepEqual(errors, ["contact-name", "company-name", "country-code", "email", "privacy", "items"]);
  assert.deepEqual(
    validateProductRfqDraft({
      locale: "en",
      formData,
      items: [selectedItem, { ...selectedItem, productId: "candidate-2" }],
      requestIntent: "compatibility-verification",
    }),
    ["compatibility"],
  );
});

test("accepts 50 Product RFQ items and rejects 51 before HTTP", () => {
  const items = Array.from({ length: 51 }, (_, index) => ({
    ...selectedItem,
    productId: `candidate-${index + 1}`,
  }));
  assert.equal(
    validateProductRfqDraft({ locale: "en", formData, items: items.slice(0, 50) }).includes("item-limit"),
    false,
  );
  assert.equal(
    validateProductRfqDraft({ locale: "en", formData, items }).includes("item-limit"),
    true,
  );
});

test("reuses one UUID for retry and creates a new UUID after payload change", async () => {
  const firstFingerprint = await fingerprintPayload(payload);
  const first = resolveAttempt(null, firstFingerprint, () => "00000000-0000-4000-8000-000000000001");
  const retry = resolveAttempt(first, firstFingerprint, () => "00000000-0000-4000-8000-000000000002");
  assert.equal(retry.idempotencyKey, first.idempotencyKey);

  const changed = mapProductRfqPayload({
    locale: "ar",
    formData,
    items: [{ ...selectedItem, quantity: 11 }],
  });
  const changedAttempt = resolveAttempt(
    first,
    await fingerprintPayload(changed),
    () => "00000000-0000-4000-8000-000000000002",
  );
  assert.notEqual(changedAttempt.idempotencyKey, first.idempotencyKey);
});

test("restores a retryable attempt after refresh and invalidates it after an edit", async () => {
  const values = new Map();
  const originalWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    },
  };

  try {
    const first = await getOrCreateAttempt(payload);
    markAttemptRetryable(first);
    const restored = await getOrCreateAttempt(payload);
    assert.equal(restored.idempotencyKey, first.idempotencyKey);
    assert.equal(restored.state, "retryable");

    const editedPayload = mapProductRfqPayload({
      locale: "ar",
      formData,
      items: [{ ...selectedItem, quantity: 11 }],
    });
    const edited = await getOrCreateAttempt(editedPayload);
    assert.notEqual(edited.idempotencyKey, first.idempotencyKey);

    clearAttempt();
    assert.equal(values.size, 0);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});

test("submits with JSON, credentials, and the supplied idempotency key", async () => {
  let observed;
  const fetchImpl = async (url, init) => {
    observed = { url, init };
    return new Response(JSON.stringify(responseBody), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  };
  const result = await submitProductRfq(payload, "00000000-0000-4000-8000-000000000001", {
    baseUrl: "http://localhost:4000/",
    fetchImpl,
  });
  assert.equal(result.publicReference, responseBody.publicReference);
  assert.equal(observed.url, "http://localhost:4000/v1/rfqs/product");
  assert.equal(observed.init.credentials, "include");
  assert.equal(observed.init.headers["Idempotency-Key"], "00000000-0000-4000-8000-000000000001");
  assert.deepEqual(JSON.parse(observed.init.body), payload);
});

test("treats a 200 replay as success with the same public reference", async () => {
  const fetchImpl = async () => new Response(JSON.stringify(responseBody), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  const replay = await submitProductRfq(payload, "00000000-0000-4000-8000-000000000001", {
    baseUrl: "http://localhost:4000",
    fetchImpl,
  });
  assert.equal(replay.publicReference, responseBody.publicReference);
});

test("loads receipt with credentials and maps unavailable receipt safely", async () => {
  let credentials;
  const receipt = await getRfqReceipt({
    baseUrl: "http://localhost:4000",
    fetchImpl: async (_url, init) => {
      credentials = init.credentials;
      return new Response(JSON.stringify({ ...responseBody, locale: "en" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
  assert.equal(credentials, "include");
  assert.equal(receipt.locale, "en");

  await assert.rejects(
    getRfqReceipt({
      baseUrl: "http://localhost:4000",
      fetchImpl: async () => new Response(
        JSON.stringify({ error: { code: "RFQ_RECEIPT_UNAVAILABLE", message: "do not expose" } }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      ),
    }),
    (error) => error instanceof RfqApiError && error.kind === "receipt-unavailable",
  );
});

test("maps backend errors and network failure without exposing raw messages", async () => {
  assert.equal(mapRfqError(400, "VALIDATION_FAILED").kind, "validation");
  assert.equal(mapRfqError(409, "RFQ_IDEMPOTENCY_CONFLICT").kind, "idempotency-conflict");
  assert.equal(mapRfqError(409, "RFQ_SUBMISSION_IN_PROGRESS").kind, "submission-in-progress");
  assert.equal(mapRfqError(413, "PAYLOAD_TOO_LARGE").kind, "payload-too-large");
  assert.equal(mapRfqError(415, "UNSUPPORTED_MEDIA_TYPE").kind, "unsupported-media-type");
  const rateLimit = mapRfqError(429, "RATE_LIMIT_EXCEEDED", "7");
  assert.equal(rateLimit.retryAfterSeconds, 7);
  assert.equal(retryDelayMilliseconds(rateLimit), 7_000);
  assert.equal(mapRfqError(503, "RFQ_SUBMISSION_CAPACITY_EXCEEDED").kind, "capacity");
  assert.equal(mapRfqError(503, "RFQ_REFERENCE_GENERATION_FAILED").kind, "reference-generation");
  assert.equal(mapRfqError(500, "INTERNAL_ERROR").kind, "server");
  assert.equal(mapRfqError(503, null).kind, "server");
  await assert.rejects(
    submitProductRfq(payload, "00000000-0000-4000-8000-000000000001", {
      baseUrl: "http://localhost:4000",
      fetchImpl: async () => { throw new Error("offline"); },
    }),
    (error) => error instanceof RfqApiError && error.kind === "network",
  );
});

test("only successful HTTP outcomes clear the draft and attempt", () => {
  assert.equal(shouldClearDraft(201), true);
  assert.equal(shouldClearDraft(200), true);
  for (const status of [400, 409, 413, 415, 429, 500, 503]) assert.equal(shouldClearDraft(status), false);
});
