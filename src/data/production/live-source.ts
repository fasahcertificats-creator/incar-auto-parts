import type { CatalogIntake } from "@/features/catalog-intake/contracts";

// Server-side only: Next's /v1/:path* rewrite in next.config.ts only
// applies to requests that pass through Next's own HTTP layer (browser
// fetches, route handlers) — a fetch() made here, during server-component
// rendering, runs directly in Node and needs the backend's real internal
// URL, matching next.config.ts's own fallback exactly.
const apiInternalUrl = (
  process.env.INCAR_API_INTERNAL_URL ?? "http://localhost:4000"
).replace(/\/+$/u, "");

const EMPTY_CATALOG: CatalogIntake = { makes: [], models: [], categories: [], products: [] };

/**
 * Fetches the published catalog from the live backend. Never throws — an
 * unreachable backend or a malformed response degrades to an empty catalog
 * (the same "published but empty" state catalog.json already handled when
 * it started empty), not a broken build or a 500 page.
 */
export async function fetchLiveCatalog(): Promise<CatalogIntake> {
  try {
    const response = await fetch(`${apiInternalUrl}/v1/catalog`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return EMPTY_CATALOG;
    const payload = (await response.json()) as unknown;
    if (
      typeof payload !== "object" ||
      payload === null ||
      !Array.isArray((payload as Partial<CatalogIntake>).makes) ||
      !Array.isArray((payload as Partial<CatalogIntake>).models) ||
      !Array.isArray((payload as Partial<CatalogIntake>).categories) ||
      !Array.isArray((payload as Partial<CatalogIntake>).products)
    ) {
      return EMPTY_CATALOG;
    }
    return payload as CatalogIntake;
  } catch {
    return EMPTY_CATALOG;
  }
}
