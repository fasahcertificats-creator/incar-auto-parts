import type { Product, ProductFitment } from "@/types/product";
import { isProductPublishingEligible } from "@/features/discovery/eligibility";

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateProductFitment(fitment: ProductFitment) {
  return Boolean(
    hasText(fitment.makeId) &&
      hasText(fitment.modelId) &&
      fitment.compatibilityStatus &&
      (fitment.verifiedYearRanges ?? []).every(
        (range) =>
          Number.isFinite(range.from) &&
          Number.isFinite(range.to) &&
          range.from <= range.to,
      ),
  );
}

export function validateProductShape(product: Product) {
  return Boolean(
    isProductPublishingEligible(product) &&
      product.vehicleRelationships.every(validateProductFitment) &&
      typeof product.isSampleData === "boolean" &&
      typeof product.hasCriticalDataConflict === "boolean",
  );
}

export function findInvalidProducts(products: Product[]) {
  return products.filter((product) => !validateProductShape(product));
}
