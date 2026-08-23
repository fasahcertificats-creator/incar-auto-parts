const localFallback = "http://localhost:4000";

/**
 * Shared by next.config.ts's /v1/:path* rewrite (browser/route-handler
 * requests) and src/data/production/live-source.ts (server-component
 * fetch(), which runs directly in Node and never passes through Next's own
 * HTTP layer, so the rewrite doesn't apply to it) — both need the exact same
 * backend URL, so it's resolved in one place instead of two independent
 * copies of the same fallback.
 */
export function getApiInternalUrl(): string {
  const configured = process.env.INCAR_API_INTERNAL_URL?.trim();
  return (configured || localFallback).replace(/\/+$/u, "");
}
