import { getApiInternalUrl } from "@/lib/api-internal-url";

const apiInternalUrl = getApiInternalUrl();

export type ProductPricing = { directSalePriceUsd: string; availableForInstantPurchase: true };

/**
 * Server-side-only fetch of the single-product detail endpoint, used solely
 * to read the two commercial fields (`directSalePriceUsd`,
 * `availableForInstantPurchase`) the bulk `/v1/catalog` dump deliberately
 * omits (see docs/phase-3b-plan.md §1/§7). Mirrors fetchLiveCatalog()'s
 * "never throws, degrades gracefully" contract — an unreachable backend or a
 * product with no pricing simply yields `null`, not a broken product page.
 */
export async function getProductPricing(slug: string): Promise<ProductPricing | null> {
  try {
    const response = await fetch(`${apiInternalUrl}/v1/catalog/products/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as unknown;
    if (typeof payload !== "object" || payload === null) return null;
    const record = payload as Record<string, unknown>;
    if (record.availableForInstantPurchase !== true || typeof record.directSalePriceUsd !== "string") {
      return null;
    }
    return { directSalePriceUsd: record.directSalePriceUsd, availableForInstantPurchase: true };
  } catch {
    return null;
  }
}
