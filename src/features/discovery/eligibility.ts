import type { Make, Model, Product } from "@/types/product";

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

export function isProductPublishingEligible(product: Product) {
  const hasReference = Boolean(
    product.references.incarPartNumber?.trim() ||
      product.references.oemReferences.some(hasText),
  );

  return Boolean(
    product.status === "published" &&
      hasText(product.internalProductId) &&
      hasText(product.slug) &&
      hasText(product.name.ar) &&
      hasText(product.name.en) &&
      hasReference &&
      product.vehicleRelationships.length > 0 &&
      product.compatibilityStatus &&
      product.requestEligibility &&
      !product.hasCriticalDataConflict,
  );
}

export function isModelPageEligible(model: Model, products: Product[]) {
  return Boolean(
    model.status === "published" &&
      hasText(model.id) &&
      hasText(model.slug) &&
      hasText(model.name) &&
      products.some(
        (product) =>
          isProductPublishingEligible(product) &&
          product.vehicleRelationships.some(
            (relationship) => relationship.modelId === model.id,
          ),
      ),
  );
}

export function isModelIndexEligible(model: Model, products: Product[]) {
  const hasModelSpecificContent = Object.values(model.content ?? {}).some(hasText);
  const hasVerifiedRelationship = products.some(
    (product) =>
      isProductPublishingEligible(product) &&
      !product.isSampleData &&
      product.dataVerificationState === "verified" &&
      product.vehicleRelationships.some(
        (relationship) =>
          relationship.modelId === model.id &&
          relationship.compatibilityStatus === "verified",
      ),
  );

  return Boolean(
    isModelPageEligible(model, products) &&
      !model.isSampleData &&
      hasModelSpecificContent &&
      hasVerifiedRelationship,
  );
}

export function isMakePageEligible(
  make: Make,
  models: Model[],
  products: Product[],
) {
  return Boolean(
    make.status === "published" &&
      hasText(make.id) &&
      hasText(make.slug) &&
      hasText(make.name) &&
      models.some(
        (model) =>
          model.makeId === make.id && isModelPageEligible(model, products),
      ),
  );
}

export function isProductIndexEligible(product: Product) {
  return Boolean(
    isProductPublishingEligible(product) &&
      !product.isSampleData &&
      product.dataVerificationState === "verified",
  );
}
