import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { vehicleModels } from "@/data/models";
import { products } from "@/data/products";
import { sampleDataEnabled } from "@/config/sample-data";
import type { BrandName, Product, ProductCategory } from "@/types/product";

export type ProductFilters = {
  brand?: BrandName | "All";
  model?: string;
  category?: ProductCategory | "All";
  query?: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function productSearchText(product: Product) {
  return [
    product.name,
    product.partNumber,
    product.oemNumber,
    product.brand,
    product.vehicleModel,
    product.category,
    product.compatibility
      .map(
        (fitment) =>
          `${fitment.brand} ${fitment.model} ${fitment.generation} ${fitment.yearFrom} ${fitment.yearTo}`,
      )
      .join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function getAllProducts() {
  return products;
}

export function getActiveProducts() {
  return products.filter(
    (product) =>
      product.status === "active" &&
      (!product.isSampleData || sampleDataEnabled),
  );
}

export function getProductBySlug(slug: string) {
  return getActiveProducts().find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return getActiveProducts().find((product) => product.id === id);
}

export function getProductsByBrand(brand: BrandName) {
  return getActiveProducts().filter((product) => product.brand === brand);
}

export function getProductsByCategory(category: ProductCategory) {
  return getActiveProducts().filter((product) => product.category === category);
}

export function getProductsByVehicleModel(model: string) {
  return getActiveProducts().filter(
    (product) =>
      product.vehicleModel === model ||
      product.compatibility.some((fitment) => fitment.model === model),
  );
}

export function searchProducts(query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return getActiveProducts();

  return getActiveProducts().filter((product) =>
    productSearchText(product).includes(normalizedQuery),
  );
}

export function filterProducts(filters: ProductFilters) {
  const queryResults = searchProducts(filters.query ?? "");

  return queryResults.filter((product) => {
    const brandMatches =
      !filters.brand || filters.brand === "All" || product.brand === filters.brand;
    const modelMatches =
      !filters.model ||
      filters.model === "All" ||
      product.vehicleModel === filters.model ||
      product.compatibility.some((fitment) => fitment.model === filters.model);
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
        item.id !== product.id &&
        (item.brand === product.brand ||
          item.vehicleModel === product.vehicleModel ||
          item.category === product.category),
    )
    .slice(0, limit);
}

export function getActiveBrands() {
  return brands.filter((brand) => brand.isActive);
}

export function getActiveCategories() {
  return categories.filter((category) => category.isActive);
}

export function getActiveVehicleModels(brand?: BrandName) {
  return vehicleModels.filter(
    (model) => model.isActive && (!brand || model.brand === brand),
  );
}
