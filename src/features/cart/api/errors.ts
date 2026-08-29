export type OrderErrorKind =
  | "validation"
  | "receipt-unavailable"
  | "not-found"
  | "conflict"
  | "payload-too-large"
  | "unsupported-media-type"
  | "rate-limit"
  | "server-unavailable"
  | "network"
  | "timeout"
  | "server"
  | "unknown";

export class OrderApiError extends Error {
  readonly kind: OrderErrorKind;
  readonly status: number | null;
  readonly code: string | null;
  readonly retryAfterSeconds: number | null;

  constructor(
    kind: OrderErrorKind,
    status: number | null,
    code: string | null,
    retryAfterSeconds: number | null = null,
  ) {
    super(kind);
    this.name = "OrderApiError";
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

export function mapOrderError(
  status: number,
  code: string | null,
  retryAfter: string | null = null,
): OrderApiError {
  const retryAfterSeconds = parseRetryAfter(retryAfter);
  if (status === 400) return new OrderApiError("validation", status, code);
  if (status === 401) return new OrderApiError("receipt-unavailable", status, code);
  if (status === 404) return new OrderApiError("not-found", status, code);
  if (status === 409) return new OrderApiError("conflict", status, code);
  if (status === 413) return new OrderApiError("payload-too-large", status, code);
  if (status === 415) return new OrderApiError("unsupported-media-type", status, code);
  if (status === 429) return new OrderApiError("rate-limit", status, code, retryAfterSeconds);
  if (status === 503) return new OrderApiError("server-unavailable", status, code);
  if (status >= 500) return new OrderApiError("server", status, code);
  return new OrderApiError("unknown", status, code);
}
