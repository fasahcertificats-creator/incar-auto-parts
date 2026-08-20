import type { InquiryPayload, InquirySubmissionResponse } from "./contracts.ts";
import { mapInquiryError, InquiryApiError } from "./errors.ts";

type FetchImplementation = typeof fetch;
type ClientOptions = { baseUrl?: string; fetchImpl?: FetchImplementation; signal?: AbortSignal };

const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

function getApiBaseUrl(override?: string) {
  const configured = override ?? process.env.NEXT_PUBLIC_INCAR_API_BASE_URL;
  const normalized = configured?.trim().replace(/\/+$/u, "");
  return normalized ?? "";
}

/**
 * Combines a caller-supplied signal (if any) with an internal request
 * timeout, so every request aborts on its own even when the caller never
 * passes one — the underlying `fetch` call has no timeout by default.
 *
 * Implemented with a plain `AbortController` + event listeners (rather than
 * `AbortSignal.any`) so it doesn't depend on a very recent lib.dom.d.ts.
 */
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

function isInquirySubmissionResponse(value: unknown): value is InquirySubmissionResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  return (
    typeof response.publicReference === "string" &&
    (response.type === "contact" ||
      response.type === "private-label" ||
      response.type === "catalog-request") &&
    typeof response.status === "string" &&
    typeof response.submittedAt === "string" &&
    (response.locale === "ar" || response.locale === "en")
  );
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
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new InquiryApiError("timeout", null, null);
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new InquiryApiError("timeout", null, null);
    }
    throw new InquiryApiError("network", null, null);
  }
  if (!response.ok) {
    throw mapInquiryError(
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
    throw new InquiryApiError("server", response.status, "INQUIRY_RESPONSE_INVALID");
  }
}

export function submitInquiry(
  payload: InquiryPayload,
  idempotencyKey: string,
  options: ClientOptions = {},
) {
  return requestJson<InquirySubmissionResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/inquiries`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal: withTimeout(options.signal, DEFAULT_REQUEST_TIMEOUT_MS),
    },
    options.fetchImpl ?? fetch,
    isInquirySubmissionResponse,
  );
}
