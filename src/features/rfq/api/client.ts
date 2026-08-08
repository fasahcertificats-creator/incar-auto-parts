import type { ProductRfqPayload, RfqReceiptResponse, RfqSubmissionResponse } from "./contracts.ts";
import { mapRfqError, RfqApiError } from "./errors.ts";

type FetchImplementation = typeof fetch;
type ClientOptions = { baseUrl?: string; fetchImpl?: FetchImplementation };

function getApiBaseUrl(override?: string) {
  const configured = override ?? process.env.NEXT_PUBLIC_INCAR_API_BASE_URL;
  const normalized = configured?.trim().replace(/\/+$/u, "");
  if (!normalized) throw new RfqApiError("configuration", null, "RFQ_API_BASE_URL_MISSING");
  return normalized;
}
async function readErrorCode(response: Response): Promise<string | null> {
  try {
    const body = (await response.json()) as { error?: { code?: unknown } };
    return typeof body.error?.code === "string" ? body.error.code : null;
  } catch {
    return null;
  }
}

function isSubmissionResponse(value: unknown): value is RfqSubmissionResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  return typeof response.publicReference === "string" &&
    response.requestType === "product-rfq" &&
    (response.requestIntent === null || response.requestIntent === "compatibility-verification") &&
    typeof response.status === "string" && typeof response.submittedAt === "string";
}

async function requestJson<T>(
  url: string,
  init: RequestInit,
  fetchImpl: FetchImplementation,
  validate: (value: unknown) => value is T,
): Promise<T> {
  let response: Response;
  try {
    response = await fetchImpl(url, init);
  } catch {
    throw new RfqApiError("network", null, null);
  }
  if (!response.ok) {
    throw mapRfqError(
      response.status,
      await readErrorCode(response),
      response.headers.get("Retry-After"),
    );
  }
  try {
    const value: unknown = await response.json();
    if (!validate(value)) throw new Error("Invalid response shape");
    return value;
  } catch {
    throw new RfqApiError("server", response.status, "RFQ_RESPONSE_INVALID");
  }
}

export function submitProductRfq(
  payload: ProductRfqPayload,
  idempotencyKey: string,
  options: ClientOptions = {},
) {
  return requestJson<RfqSubmissionResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/rfqs/product`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    },
    options.fetchImpl ?? fetch,
    isSubmissionResponse,
  );
}

export function getRfqReceipt(options: ClientOptions = {}) {
  return requestJson<RfqReceiptResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/rfqs/receipt`,
    { method: "GET", credentials: "include", cache: "no-store" },
    options.fetchImpl ?? fetch,
    (value): value is RfqReceiptResponse => {
      if (!isSubmissionResponse(value)) return false;
      const locale = (value as { locale?: unknown }).locale;
      return locale === "ar" || locale === "en";
    },
  );
}
