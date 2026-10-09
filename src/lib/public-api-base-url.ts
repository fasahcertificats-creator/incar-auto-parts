/**
 * Client-side counterpart of src/lib/api-internal-url.ts. The Vercel project
 * still carries stale Railway URLs from before the 2026-10 Render migration;
 * a Railway value here would send browser requests to a dead host, so fall
 * back to "" (same-origin), which routes through Next's /v1 rewrite and
 * therefore through getApiInternalUrl()'s Render resolution.
 */
export function getPublicApiBaseUrl(override?: string): string {
  const configured = override ?? process.env.NEXT_PUBLIC_INCAR_API_BASE_URL;
  const normalized = configured?.trim().replace(/\/+$/u, "");
  if (normalized && normalized.includes("railway.app")) return "";
  return normalized ?? "";
}
