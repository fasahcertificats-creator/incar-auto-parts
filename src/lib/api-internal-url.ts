const localFallback = "http://localhost:4000";

// Render deployment (post-Railway migration, 2026-10). The Vercel project
// still carries a stale INCAR_API_INTERNAL_URL pointing at the dead Railway
// service; until that env var is updated in the Vercel dashboard, production
// builds running on Vercel must ignore any *.railway.app value and use this.
const renderProductionUrl = "https://incar-api-asyj.onrender.com";

/**
 * Shared by next.config.ts's /v1/:path* rewrite (browser/route-handler
 * requests) and src/data/production/live-source.ts (server-component
 * fetch(), which runs directly in Node and never passes through Next's own
 * HTTP layer, so the rewrite doesn't apply to it) — both need the exact same
 * backend URL, so it's resolved in one place instead of two independent
 * copies of the same fallback.
 */
export function getApiInternalUrl(): string {
  const configured = process.env.INCAR_API_INTERNAL_URL?.trim().replace(/\/+$/u, "");
  if (process.env.VERCEL) {
    if (!configured || configured.includes("railway.app")) {
      return renderProductionUrl;
    }
    return configured;
  }
  return configured || localFallback;
}
