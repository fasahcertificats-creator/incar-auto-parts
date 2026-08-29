import type {
  BankDetailsResponse,
  OrderCartItemInput,
  OrderContactInput,
  OrderLookupResponse,
  ProductDetailResponse,
  PublicOrderResponse,
} from "./contracts";
import { mapOrderError, OrderApiError } from "./errors";

type FetchImplementation = typeof fetch;
type ClientOptions = { baseUrl?: string; fetchImpl?: FetchImplementation; signal?: AbortSignal };

const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;
const DEFAULT_UPLOAD_TIMEOUT_MS = 60_000;

function getApiBaseUrl(override?: string) {
  const configured = override ?? process.env.NEXT_PUBLIC_INCAR_API_BASE_URL;
  const normalized = configured?.trim().replace(/\/+$/u, "");
  return normalized ?? "";
}

/** See src/features/rfq/api/client.ts's withTimeout — same rationale, kept
 * as a local copy so this feature's client has no cross-feature import. */
function withTimeout(callerSignal: AbortSignal | undefined, timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  if (timeoutSignal.aborted) controller.abort(timeoutSignal.reason);
  else timeoutSignal.addEventListener("abort", () => controller.abort(timeoutSignal.reason), { once: true });
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort(callerSignal.reason);
    else callerSignal.addEventListener("abort", () => controller.abort(callerSignal.reason), { once: true });
  }
  return controller.signal;
}

async function readErrorCode(response: Response): Promise<string | null> {
  try {
    const body = (await response.json()) as { error?: { code?: unknown } };
    return typeof body.error?.code === "string" ? body.error.code : null;
  } catch {
    return null;
  }
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
  } catch (error) {
    if (error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new OrderApiError("timeout", null, null);
    }
    throw new OrderApiError("network", null, null);
  }
  if (!response.ok) {
    throw mapOrderError(response.status, await readErrorCode(response), response.headers.get("Retry-After"));
  }
  try {
    const value: unknown = await response.json();
    if (!validate(value)) throw new Error("Invalid response shape");
    return value;
  } catch {
    throw new OrderApiError("server", response.status, "ORDER_RESPONSE_INVALID");
  }
}

const object = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object";

function isOrderLineItem(value: unknown): boolean {
  if (!object(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.productId === "string" &&
    typeof value.nameAr === "string" &&
    typeof value.nameEn === "string" &&
    typeof value.partNumber === "string" &&
    typeof value.quantity === "number" &&
    typeof value.unitPriceUsd === "string" &&
    typeof value.sortOrder === "number"
  );
}

function isPublicOrderResponse(value: unknown): value is PublicOrderResponse {
  if (!object(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.publicReference === "string" &&
    typeof value.status === "string" &&
    value.currency === "USD" &&
    typeof value.subtotalUsd === "string" &&
    typeof value.totalUsd === "string" &&
    typeof value.contactName === "string" &&
    typeof value.phone === "string" &&
    (value.whatsapp === null || typeof value.whatsapp === "string") &&
    typeof value.email === "string" &&
    typeof value.addressLine1 === "string" &&
    (value.addressLine2 === null || typeof value.addressLine2 === "string") &&
    typeof value.city === "string" &&
    typeof value.country === "string" &&
    (value.postalCode === null || typeof value.postalCode === "string") &&
    (value.customerNotes === null || typeof value.customerNotes === "string") &&
    Array.isArray(value.lineItems) &&
    value.lineItems.every(isOrderLineItem) &&
    typeof value.createdAt === "string"
  );
}

function isOrderLookupResponse(value: unknown): value is OrderLookupResponse {
  if (!object(value)) return false;
  if (value.found === false) return true;
  return value.found === true && isPublicOrderResponse(value.order);
}

function isBankDetailsResponse(value: unknown): value is BankDetailsResponse {
  if (!object(value)) return false;
  return (
    typeof value.available === "boolean" &&
    (value.bankName === null || typeof value.bankName === "string") &&
    (value.accountNumber === null || typeof value.accountNumber === "string") &&
    (value.iban === null || typeof value.iban === "string") &&
    (value.swift === null || typeof value.swift === "string") &&
    (value.accountHolder === null || typeof value.accountHolder === "string")
  );
}

function isProductDetailResponse(value: unknown): value is ProductDetailResponse {
  return object(value) && typeof value.slug === "string";
}

export function getProductDetail(slug: string, options: ClientOptions = {}) {
  return requestJson<ProductDetailResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/catalog/products/${encodeURIComponent(slug)}`,
    { method: "GET", cache: "no-store", signal: withTimeout(options.signal, DEFAULT_REQUEST_TIMEOUT_MS) },
    options.fetchImpl ?? fetch,
    isProductDetailResponse,
  );
}

export function getBankDetails(options: ClientOptions = {}) {
  return requestJson<BankDetailsResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/orders/bank-details`,
    { method: "GET", cache: "no-store", signal: withTimeout(options.signal, DEFAULT_REQUEST_TIMEOUT_MS) },
    options.fetchImpl ?? fetch,
    isBankDetailsResponse,
  );
}

export function submitOrder(
  items: OrderCartItemInput[],
  contact: OrderContactInput,
  proof: File,
  options: ClientOptions = {},
) {
  const form = new FormData();
  form.append("payload", JSON.stringify({ items, contact }));
  form.append("proof", proof);
  return requestJson<PublicOrderResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/orders`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      body: form,
      signal: withTimeout(options.signal, DEFAULT_UPLOAD_TIMEOUT_MS),
    },
    options.fetchImpl ?? fetch,
    isPublicOrderResponse,
  );
}

export function getOrderReceipt(options: ClientOptions = {}) {
  return requestJson<PublicOrderResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/orders/receipt`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal: withTimeout(options.signal, DEFAULT_REQUEST_TIMEOUT_MS),
    },
    options.fetchImpl ?? fetch,
    isPublicOrderResponse,
  );
}

export function lookupOrder(publicReference: string, email: string, options: ClientOptions = {}) {
  return requestJson<OrderLookupResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/orders/lookup`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ publicReference, email }),
      signal: withTimeout(options.signal, DEFAULT_REQUEST_TIMEOUT_MS),
    },
    options.fetchImpl ?? fetch,
    isOrderLookupResponse,
  );
}

export function resubmitPaymentProof(proof: File, options: ClientOptions = {}) {
  const form = new FormData();
  form.append("proof", proof);
  return requestJson<PublicOrderResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/orders/payment-proof`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      body: form,
      signal: withTimeout(options.signal, DEFAULT_UPLOAD_TIMEOUT_MS),
    },
    options.fetchImpl ?? fetch,
    isPublicOrderResponse,
  );
}
