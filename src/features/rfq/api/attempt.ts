import type { ProductRfqPayload } from "./contracts.ts";

export type RfqAttempt = {
  version: 1;
  idempotencyKey: string;
  payloadFingerprint: string;
  state: "ready" | "retryable";
};

const attemptStorageKey = "incar-product-rfq-attempt-v1";

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, canonicalize(child)]),
    );
  }
  return value;
}
export async function fingerprintPayload(payload: ProductRfqPayload): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(canonicalize(payload)));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function resolveAttempt(
  stored: RfqAttempt | null,
  payloadFingerprint: string,
  createUuid: () => string = () => crypto.randomUUID(),
): RfqAttempt {
  if (stored?.version === 1 && stored.payloadFingerprint === payloadFingerprint) return stored;
  return {
    version: 1,
    idempotencyKey: createUuid(),
    payloadFingerprint,
    state: "ready",
  };
}

function readStoredAttempt(): RfqAttempt | null {
  try {
    const raw = window.localStorage.getItem(attemptStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RfqAttempt>;
    if (
      parsed.version !== 1 ||
      typeof parsed.idempotencyKey !== "string" ||
      typeof parsed.payloadFingerprint !== "string" ||
      (parsed.state !== "ready" && parsed.state !== "retryable")
    ) return null;
    return parsed as RfqAttempt;
  } catch {
    return null;
  }
}

export async function getOrCreateAttempt(payload: ProductRfqPayload): Promise<RfqAttempt> {
  const attempt = resolveAttempt(readStoredAttempt(), await fingerprintPayload(payload));
  window.localStorage.setItem(attemptStorageKey, JSON.stringify(attempt));
  return attempt;
}

export function markAttemptRetryable(attempt: RfqAttempt) {
  window.localStorage.setItem(
    attemptStorageKey,
    JSON.stringify({ ...attempt, state: "retryable" } satisfies RfqAttempt),
  );
}

export function clearAttempt() {
  window.localStorage.removeItem(attemptStorageKey);
}

export const invalidateAttempt = clearAttempt;

export function shouldClearDraft(httpStatus: number) {
  return httpStatus === 200 || httpStatus === 201;
}
