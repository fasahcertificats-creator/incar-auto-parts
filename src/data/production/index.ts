import { cache } from "react";
import { fetchLiveCatalog } from "./live-source";
import { validateCatalogIntake } from "@/features/catalog-intake/validation";

/**
 * Was a synchronous module-level constant built from catalog.json at
 * import time. Now backed by the live admin-managed catalog (see
 * PublicCatalogController on the backend), fetched per-request. Next's
 * fetch cache dedupes the network round-trip, but validateCatalogIntake
 * itself is a nontrivial synchronous pass over every record — wrapped in
 * React's cache() so the many discovery/repository functions that each
 * call this per page render share one validation pass instead of paying
 * for it repeatedly.
 */
export const loadProductionCatalog = cache(async () => {
  const rawCatalog = await fetchLiveCatalog();
  return validateCatalogIntake(rawCatalog);
});
