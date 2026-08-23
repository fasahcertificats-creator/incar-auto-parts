// Mirrors the backend's isValidCatalogSlug (incar-backend
// src/modules/catalog/domain/normalization.ts): lowercase letters, numbers,
// and single hyphens only. Kept in sync manually since the two are separate
// repos with no shared package.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SLUG_FORMAT_HINT =
  'Lowercase letters, numbers, and hyphens only (e.g. "brake-system") — no spaces or capital letters.';
