export type RfqErrorKind =
  | "configuration"
  | "validation"
  | "receipt-unavailable"
  | "idempotency-conflict"
  | "submission-in-progress"
  | "payload-too-large"
  | "unsupported-media-type"
  | "rate-limit"
  | "capacity"
  | "reference-generation"
  | "network"
  | "server"
  | "unknown";

export class RfqApiError extends Error {
  readonly kind: RfqErrorKind;
  readonly status: number | null;
  readonly code: string | null;
  readonly retryAfterSeconds: number | null;

  constructor(
    kind: RfqErrorKind,
    status: number | null,
    code: string | null,
    retryAfterSeconds: number | null = null,
  ) {
    super(kind);
    this.name = "RfqApiError";
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

export function mapRfqError(status: number, code: string | null, retryAfter: string | null = null) {
  const retryAfterSeconds = parseRetryAfter(retryAfter);
  if (status === 400) return new RfqApiError("validation", status, code);
  if (status === 401 && code === "RFQ_RECEIPT_UNAVAILABLE") {
    return new RfqApiError("receipt-unavailable", status, code);
  }
  if (status === 409 && code === "RFQ_IDEMPOTENCY_CONFLICT") {
    return new RfqApiError("idempotency-conflict", status, code);
  }
  if (status === 409 && code === "RFQ_SUBMISSION_IN_PROGRESS") {
    return new RfqApiError("submission-in-progress", status, code);
  }
  if (status === 413) return new RfqApiError("payload-too-large", status, code);
  if (status === 415) return new RfqApiError("unsupported-media-type", status, code);
  if (status === 429) return new RfqApiError("rate-limit", status, code, retryAfterSeconds);
  if (status === 503 && code === "RFQ_SUBMISSION_CAPACITY_EXCEEDED") {
    return new RfqApiError("capacity", status, code);
  }
  if (status === 503 && code === "RFQ_REFERENCE_GENERATION_FAILED") {
    return new RfqApiError("reference-generation", status, code);
  }
  if (status >= 500) return new RfqApiError("server", status, code);
  return new RfqApiError("unknown", status, code);
}

export function retryDelayMilliseconds(error: RfqApiError): number {
  if (error.kind !== "rate-limit" || error.retryAfterSeconds === null) return 0;
  return Math.min(2_147_483_647, error.retryAfterSeconds * 1_000);
}
