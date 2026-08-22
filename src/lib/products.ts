import {
  getCategoriesForModel,
  getEligibleModelsForMake,
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

export async function getProductsByBrand(brand: BrandName) {
  const makeId = brand.toLowerCase();
  const products = await getPublishedProducts();
  return products.filter((product) =>
    product.vehicleRelationships.some((relationship) => relationship.makeId === makeId),
  );
}

export async function getProductsByCategory(category: ProductCategory) {
  const products = await getActiveProducts();
  return products.filter((product) => product.category === category);
}

export async function getProductsByVehicleModel(model: string) {
  const products = await getPublishedProducts();
  return products.filter((product) =>
    product.vehicleRelationships.some((relationship) => relationship.modelName === model),
  );
}

export async function searchProducts(query: string) {
  if (!query.trim()) return getPublishedProducts();
  const result = await searchProductsByReference(query);
  return [...result.exactMatches, ...result.possibleMatches].map((match) => match.product);
}

export async function filterProducts(filters: ProductFilters) {
  const queryResults = await searchProducts(filters.query ?? "");

  return queryResults.filter((product) => {
    const relationship = product.vehicleRelationships[0];
    const brandMatches =
      !filters.brand || filters.brand === "All" || relationship?.makeName === filters.brand;
    const modelMatches =
      !filters.model ||
      filters.model === "All" ||
      product.vehicleRelationships.some((candidate) => candidate.modelName === filters.model);
    const categoryMatches =
      !filters.category || filters.category === "All" || product.category === filters.category;

    return brandMatches && modelMatches && categoryMatches;
  });
}

export async function getFeaturedProducts(limit = 6) {
  const products = await getActiveProducts();
  return products.slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 3) {
  const products = await getActiveProducts();
  return products
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

export async function getActiveBrands() {
  const makes = await getPublishedMakes();
  return makes.map((make) => ({ ...make, displayName: make.name, isActive: true }));
}

export async function getActiveCategories() {
  const makes = await getPublishedMakes();
  const pairs = (
    await Promise.all(
      makes.map(async (make) => {
        const models = await getEligibleModelsForMake(make.id);
        const perModel = await Promise.all(
          models.map((model) => getCategoriesForModel(make.slug, model.slug)),
        );
        return perModel.flat();
      }),
    )
  ).flat();
  return Array.from(new Map(pairs.map((category) => [category.id, category])).values()).map(
    (category) => ({ ...category, displayName: category.localizedName.en, isActive: true }),
  );
}

export async function getActiveVehicleModels(brand?: BrandName) {
  const makes = brand
    ? [await getPublishedMakeBySlug(brand.toLowerCase())].filter(Boolean)
    : await getPublishedMakes();
  const perMake = await Promise.all(
    makes.map(async (make) => {
      if (!make) return [];
      const models = await getEligibleModelsForMake(make.id);
      return models.map((model) => ({
        ...model,
        brand: make.name,
        displayName: model.name,
        isActive: true,
      }));
    }),
  );
  return perMake.flat();
}
