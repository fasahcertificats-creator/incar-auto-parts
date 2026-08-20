export type InquiryErrorKind =
  | "validation"
  | "idempotency-conflict"
  | "payload-too-large"
  | "unsupported-media-type"
  | "rate-limit"
  | "capacity"
  | "reference-generation"
  | "network"
  | "timeout"
  | "server"
  | "unknown";

export class InquiryApiError extends Error {
  readonly kind: InquiryErrorKind;
  readonly status: number | null;
  readonly code: string | null;
  readonly retryAfterSeconds: number | null;

  constructor(
    kind: InquiryErrorKind,
    status: number | null,
    code: string | null,
    retryAfterSeconds: number | null = null,
  ) {
    super(kind);
    this.name = "InquiryApiError";
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function parseRetryAfter(value: string | null): number | null {
  if (!value) return null;
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 0 ? Math.ceil(seconds) : null;
}

/**
 * Maps HTTP status + error code to a client-friendly error kind. Some
 * codes (e.g. the submission-concurrency guard) are shared verbatim across
 * modules — see `SubmissionConcurrencyInterceptor` in the backend, which is
 * reused as-is by the Inquiries controller and still reports
 * "RFQ_SUBMISSION_CAPACITY_EXCEEDED" even for inquiry submissions.
 */
export function mapInquiryError(
  status: number,
  code: string | null,
  retryAfter: string | null = null,
): InquiryApiError {
  const retryAfterSeconds = parseRetryAfter(retryAfter);
  if (status === 400) return new InquiryApiError("validation", status, code);
  if (status === 409 && code === "INQUIRY_IDEMPOTENCY_CONFLICT") {
    return new InquiryApiError("idempotency-conflict", status, code);
  }
  if (status === 413) return new InquiryApiError("payload-too-large", status, code);
  if (status === 415) return new InquiryApiError("unsupported-media-type", status, code);
  if (status === 429) return new InquiryApiError("rate-limit", status, code, retryAfterSeconds);
  if (
    status === 503 &&
    ["RFQ_SUBMISSION_CAPACITY_EXCEEDED", "SERVICE_UNAVAILABLE"].includes(code ?? "")
  ) {
    return new InquiryApiError("capacity", status, code);
  }
  if (status === 503 && code === "INQUIRY_REFERENCE_GENERATION_FAILED") {
    return new InquiryApiError("reference-generation", status, code);
  }
  if (status >= 500) return new InquiryApiError("server", status, code);
  return new InquiryApiError("unknown", status, code);
}

export function retryDelayMilliseconds(error: InquiryApiError): number {
  if (error.kind !== "rate-limit" || error.retryAfterSeconds === null) return 0;
  return Math.min(2_147_483_647, error.retryAfterSeconds * 1_000);
}
