import { vehicleModels } from "@/data/models";
import type {
  BrandName,
  Product,
  ProductCategory,
  ProductFitment,
  ProductStatus,
} from "@/types/product";

const supportedBrands: BrandName[] = ["Toyota", "Hyundai"];
const supportedCategories: ProductCategory[] = [
  "Brake System",
  "Suspension Parts",
  "Filters",
  "Engine Parts",
  "Interior Parts",
];
const supportedStatuses: ProductStatus[] = ["active", "draft"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateProductFitment(fitment: ProductFitment) {
  const activeModelNames = new Set(vehicleModels.map((model) => model.name));

  return Boolean(
    supportedBrands.includes(fitment.brand) &&
      hasText(fitment.model) &&
      activeModelNames.has(fitment.model) &&
      (fitment.yearFrom === undefined || Number.isFinite(fitment.yearFrom)) &&
      (fitment.yearTo === undefined || Number.isFinite(fitment.yearTo)),
  );
}

export function validateProductShape(product: Product) {
  const activeModelNames = new Set(vehicleModels.map((model) => model.name));

  return Boolean(
    hasText(product.id) &&
      hasText(product.slug) &&
      hasText(product.name) &&
      supportedBrands.includes(product.brand) &&
      hasText(product.vehicleModel) &&
      activeModelNames.has(product.vehicleModel) &&
      supportedCategories.includes(product.category) &&
      hasText(product.partNumber) &&
      hasText(product.oemNumber) &&
      Array.isArray(product.compatibility) &&
      product.compatibility.length > 0 &&
      product.compatibility.every(validateProductFitment) &&
      hasText(product.imageUrl) &&
      isRecord(product.specifications) &&
      Object.values(product.specifications).every(hasText) &&
      Number.isFinite(product.moq) &&
      product.moq > 0 &&
      product.origin === "China" &&
      typeof product.privateLabelAvailable === "boolean" &&
      supportedStatuses.includes(product.status) &&
      typeof product.isSampleData === "boolean",
  );
}

export function findInvalidProducts(products: Product[]) {
  return products.filter((product) => !validateProductShape(product));
}
