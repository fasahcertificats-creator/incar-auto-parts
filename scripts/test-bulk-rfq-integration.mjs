import assert from "node:assert/strict";
import test from "node:test";
import {
  bulkAttemptFingerprint,
  buildBulkMapping,
  BULK_MAX_FILE_BYTES,
  isBulkTerminal,
  makeBulkFormData,
  mapBulkMetadata,
  nextPollDelay,
  resolveBulkAttempt,
  validateBulkMapping,
  validateBulkUpload,
} from "../src/features/rfq/api/bulk-mapper.ts";
import { getBulkInspection, getBulkStatus, submitBulkList, submitBulkMapping } from "../src/features/rfq/api/client.ts";
import { mapRfqError, RfqApiError, retryDelayMilliseconds } from "../src/features/rfq/api/errors.ts";

const draft = {
  companyName: "Synthetic Company", contactName: "Synthetic Contact", countryCode: "sa", city: "Riyadh",
  businessType: "wholesaler", email: "bulk@example.test", phone: "", whatsapp: "+00000000",
  customerNotes: "Synthetic only", privacyConsent: true,
};
const csv = new File(["Part Number,Quantity\nSYNTHETIC-1,2\n"], "synthetic.csv", { type: "text/csv", lastModified: 1 });
const metadata = mapBulkMetadata("en", draft);
const inspection = {
  publicReference: "INCAR-RFQ-SYNTHETIC", requestType: "bulk-list", fileStatus: "awaiting-mapping", format: "csv",
  sheets: [{ index: 0, name: null, state: "visible" }], selectedSheet: { index: 0, name: null, state: "visible" },
  headerRowNumber: 1, headers: [{ index: 0, display: "Part Number" }, { index: 1, display: "Quantity" }],
  mappingRequirements: { version: 1, targetFields: ["partNumber", "quantity"], identificationFields: ["partNumber", "oemReference", "description"], readOnly: false },
};
const status = {
  publicReference: "INCAR-RFQ-SYNTHETIC", requestStatus: "submitted", fileStatus: "queued", processingScope: "parsed-and-validated",
  summary: { totalRows: 0, validRows: 0, invalidRows: 0, processingErrorRows: 0 }, pollAfterSeconds: 3,
};

test("maps strict Bulk metadata and multipart without a manual content type", async () => {
  assert.equal(metadata.requestType, "bulk-list");
  assert.equal(metadata.requestIntent, null);
  assert.equal(metadata.marketCountryCode, "SA");
  assert.deepEqual(metadata.privacyConsent, { accepted: true });
  assert.equal("policyVersion" in metadata, false);
  const body = makeBulkFormData(metadata, csv);
  assert.deepEqual(JSON.parse(body.get("metadata")), metadata);
  assert.equal(body.get("file"), csv);
  let request;
  await submitBulkList(metadata, csv, "00000000-0000-4000-8000-000000000001", {
    baseUrl: "http://localhost:4000/", fetchImpl: async (url, init) => {
      request = { url, init };
      return Response.json({ publicReference: "INCAR-RFQ-SYNTHETIC", requestType: "bulk-list", requestIntent: null, status: "submitted", submittedAt: new Date().toISOString() }, { status: 201 });
    },
  });
  assert.equal(request.url, "http://localhost:4000/v1/rfqs/bulk-list");
  assert.equal(request.init.credentials, "include");
  assert.equal(request.init.headers["Content-Type"], undefined);
  assert.equal(request.init.headers["Idempotency-Key"], "00000000-0000-4000-8000-000000000001");
});

test("validates CSV/XLSX, file size, contact, and consent", () => {
  assert.deepEqual(validateBulkUpload(draft, csv), []);
  assert.ok(validateBulkUpload(draft, new File(["x"], "bad.xls")).includes("file-type"));
  const oversized = new File([new Uint8Array(BULK_MAX_FILE_BYTES + 1)], "large.xlsx");
  assert.ok(validateBulkUpload(draft, oversized).includes("file-size"));
  const invalid = validateBulkUpload({ ...draft, email: "bad", privacyConsent: false }, null);
  assert.ok(invalid.includes("file-required") && invalid.includes("email") && invalid.includes("privacy"));
});

test("reuses an in-memory UUID for the same file and metadata and rotates after change", () => {
  const fingerprint = bulkAttemptFingerprint(metadata, csv);
  const first = resolveBulkAttempt(null, fingerprint, () => "first");
  assert.equal(resolveBulkAttempt(first, fingerprint, () => "second").idempotencyKey, "first");
  assert.equal(resolveBulkAttempt(first, bulkAttemptFingerprint(mapBulkMetadata("ar", draft), csv), () => "second").idempotencyKey, "second");
});

test("constructs a strict mapping and prevents duplicates/minimum-useless maps", () => {
  const payload = buildBulkMapping(inspection, { 0: "partNumber", 1: "quantity" });
  assert.deepEqual(payload, { version: 1, sourceSheetIndex: 0, headerRowNumber: 1, columns: [{ sourceColumn: "Part Number", targetField: "partNumber" }, { sourceColumn: "Quantity", targetField: "quantity" }] });
  assert.equal(validateBulkMapping(payload).valid, true);
  assert.equal(validateBulkMapping({ ...payload, columns: [{ sourceColumn: "a", targetField: "quantity" }] }).useful, false);
  assert.equal(validateBulkMapping({ ...payload, columns: [{ sourceColumn: "a", targetField: "partNumber" }, { sourceColumn: "b", targetField: "partNumber" }] }).duplicate, true);
});

test("uses only bounded inspection query fields and submits JSON mapping with credentials", async () => {
  const observed = [];
  const fetchImpl = async (url, init) => {
    observed.push({ url, init });
    if (String(url).includes("inspection")) return Response.json(inspection);
    return Response.json({ publicReference: "INCAR-RFQ-SYNTHETIC", fileStatus: "queued", mappingAccepted: true });
  };
  await getBulkInspection({ sourceSheetIndex: 0, headerRowNumber: 2 }, { baseUrl: "http://localhost:4000", fetchImpl });
  const payload = buildBulkMapping(inspection, { 0: "partNumber" });
  await submitBulkMapping(payload, { baseUrl: "http://localhost:4000", fetchImpl });
  assert.equal(observed[0].url, "http://localhost:4000/v1/rfqs/bulk-list/inspection?sourceSheetIndex=0&headerRowNumber=2");
  assert.equal(observed[0].init.credentials, "include");
  assert.equal(observed[1].init.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(observed[1].init.body), payload);
});

test("accepts queued status, keeps a stable worker-offline delay, and stops at terminals", async () => {
  const result = await getBulkStatus({ baseUrl: "http://localhost:4000", fetchImpl: async (_url, init) => {
    assert.equal(init.credentials, "include"); return Response.json(status);
  } });
  assert.equal(result.pollAfterSeconds, 3);
  assert.equal(nextPollDelay(3, false), 3000);
  assert.equal(nextPollDelay(3, true), 15000);
  assert.equal(isBulkTerminal("queued"), false);
  assert.equal(isBulkTerminal("processing"), false);
  assert.equal(isBulkTerminal("completed"), true);
  assert.equal(isBulkTerminal("completed-with-errors"), true);
  assert.equal(isBulkTerminal("failed"), true);
});

test("maps receipt loss, mapping replay/conflict, upload errors, and Retry-After safely", async () => {
  assert.equal(mapRfqError(401, "RFQ_RECEIPT_UNAVAILABLE").kind, "receipt-unavailable");
  assert.equal(mapRfqError(409, "RFQ_BULK_MAPPING_LOCKED").kind, "mapping-locked");
  assert.equal(mapRfqError(400, "RFQ_BULK_INSPECTION_INVALID").kind, "inspection-invalid");
  assert.equal(mapRfqError(400, "RFQ_BULK_MAPPING_INVALID").kind, "mapping-invalid");
  assert.equal(mapRfqError(415, "RFQ_BULK_FILE_TYPE_UNSUPPORTED").kind, "unsupported-media-type");
  assert.equal(mapRfqError(503, "RFQ_BULK_STORAGE_UNAVAILABLE").kind, "capacity");
  assert.equal(retryDelayMilliseconds(mapRfqError(429, "RATE_LIMIT_EXCEEDED", "7")), 7000);
  await assert.rejects(getBulkStatus({ baseUrl: "http://localhost:4000", fetchImpl: async () => Response.json({ error: { code: "RFQ_RECEIPT_UNAVAILABLE", message: "private" } }, { status: 401 }) }),
    (error) => error instanceof RfqApiError && error.kind === "receipt-unavailable");
});

test("Bulk implementation has no browser persistence or receipt/token URL construction", async () => {
  const source = await import("node:fs/promises").then((fs) => fs.readFile(new URL("../src/features/rfq/components/BulkListJourney.tsx", import.meta.url), "utf8"));
  for (const forbidden of ["localStorage", "sessionStorage", "indexedDB", "document.cookie", "dangerouslySetInnerHTML", "Math.random", "receiptToken", "storageKey"]) assert.equal(source.includes(forbidden), false, forbidden);
});
