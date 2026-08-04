/**
 * Produces a comparison-only reference key. The original reference remains
 * unchanged in the mapped product record for display and operator review.
 */
export function normalizeCatalogReference(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidCatalogSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
