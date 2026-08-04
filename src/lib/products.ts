import {
  getCategoriesForModel,
  getEligibleModelsForMake,
  getMakeById,
  getModelById,
  getPublishedMakeBySlug,
  getPublishedMakes,
  getPublishedProductById,
  getPublishedProductBySlug,
  getPublishedProducts,
  searchProductsByReference,
} from "@/features/discovery/repository";
import type { BrandName, Product, ProductCategory } from "@/types/product";

export type ProductFilters = {
  brand?: BrandName | "All";
  model?: string;
  category?: ProductCategory | "All";
  query?: string;
};

export function getAllProducts() {
  return getPublishedProducts();
}

export function getActiveProducts() {
  return getPublishedProducts();
}

export function getProductBySlug(slug: string) {
  return getPublishedProductBySlug(slug);
}

export function getProductById(id: string) {
  return getPublishedProductById(id);
}

export function getProductsByBrand(brand: BrandName) {
  const makeId = brand.toLowerCase();
  return getPublishedProducts().filter((product) =>
    product.vehicleRelationships.some(
      (relationship) => relationship.makeId === makeId,
    ),
  );
}

export function getProductsByCategory(category: ProductCategory) {
  return getActiveProducts().filter((product) => product.category === category);
}

export function getProductsByVehicleModel(model: string) {
  return getPublishedProducts().filter((product) =>
    product.vehicleRelationships.some(
      (relationship) => getModelById(relationship.modelId)?.name === model,
    ),
  );
}

export function searchProducts(query: string) {
  if (!query.trim()) return getPublishedProducts();
  const result = searchProductsByReference(query);
  return [...result.exactMatches, ...result.possibleMatches].map(
    (match) => match.product,
  );
}

export function filterProducts(filters: ProductFilters) {
  const queryResults = searchProducts(filters.query ?? "");

  return queryResults.filter((product) => {
    const make = product.vehicleRelationships[0]
      ? getMakeById(product.vehicleRelationships[0].makeId)
      : undefined;
    const brandMatches =
      !filters.brand || filters.brand === "All" || make?.name === filters.brand;
    const modelMatches =
      !filters.model ||
      filters.model === "All" ||
      product.vehicleRelationships.some(
        (relationship) => getModelById(relationship.modelId)?.name === filters.model,
      );
    const categoryMatches =
      !filters.category ||
      filters.category === "All" ||
      product.category === filters.category;

    return brandMatches && modelMatches && categoryMatches;
  });
}

export function getFeaturedProducts(limit = 6) {
  return getActiveProducts().slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 3) {
  return getActiveProducts()
    .filter(
      (item) =>
        item.internalProductId !== product.internalProductId &&
        (item.category === product.category ||
          item.vehicleRelationships.some((relationship) =>
            product.vehicleRelationships.some(
              (candidate) => candidate.modelId === relationship.modelId,
            ),
          )),
    )
    .slice(0, limit);
}

export function getActiveBrands() {
  return getPublishedMakes().map((make) => ({
    ...make,
    displayName: make.name,
    isActive: true,
  }));
}

export function getActiveCategories() {
  const pairs = getPublishedMakes().flatMap((make) =>
    getEligibleModelsForMake(make.id).flatMap((model) =>
      getCategoriesForModel(make.slug, model.slug),
    ),
  );
  return Array.from(new Map(pairs.map((category) => [category.id, category])).values()).map(
    (category) => ({ ...category, displayName: category.localizedName.en, isActive: true }),
  );
}

export function getActiveVehicleModels(brand?: BrandName) {
  const makes = brand
    ? [getPublishedMakeBySlug(brand.toLowerCase())].filter(Boolean)
    : getPublishedMakes();
  return makes.flatMap((make) =>
    make
      ? getEligibleModelsForMake(make.id).map((model) => ({
          ...model,
          brand: make.name,
          displayName: model.name,
          isActive: true,
        }))
      : [],
  );
}
