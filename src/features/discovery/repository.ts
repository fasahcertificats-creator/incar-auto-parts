import { sampleDataEnabled } from "@/config/sample-data";
import { brands as sampleMakeRecords } from "@/data/brands";
import { categories as sampleCategoryRecords } from "@/data/categories";
import { vehicleModels as sampleModelRecords } from "@/data/models";
import { products as sampleProductRecords } from "@/data/products";
import { productionCatalog } from "@/data/production";
import type { Locale } from "@/i18n/types";
import type {
  Category,
  Make,
  Model,
  Product,
  ReferenceMatch,
} from "@/types/product";
import {
  isMakePageEligible,
  isModelIndexEligible,
  isModelPageEligible,
  isProductIndexEligible,
  isProductPublishingEligible,
} from "./eligibility";
import { normalizeCatalogReference } from "../catalog-intake/normalization";

export type DiscoverySearchContext = {
  makeSlug?: string;
  modelSlug?: string;
};

export type ProductReferenceMatch = {
  product: Product;
  referenceMatch: Exclude<ReferenceMatch, "none">;
  matchedReference?: string;
};

export type DiscoverySearchResult = {
  status: "success" | "none" | "error";
  originalQuery: string;
  normalizedQuery: string;
  referenceMatch: ReferenceMatch;
  exactMatches: ProductReferenceMatch[];
  possibleMatches: ProductReferenceMatch[];
};

// Production records can enter Discovery only through the validated intake pipeline.
const productionMakes: Make[] = productionCatalog.makes;
const productionModels: Model[] = productionCatalog.models;
const productionCategories: Category[] = productionCatalog.categories;
const productionProducts: Product[] = productionCatalog.products;
const draftMakes: Make[] = [];
const draftModels: Model[] = [];
const draftProducts: Product[] = [];

const sampleMakes: Make[] = sampleMakeRecords.map((make) => ({
  id: make.id,
  slug: make.slug,
  name: make.name,
  status: make.isActive ? "published" : "draft",
  isSampleData: true,
  publishingEligibility: "ineligible",
  description: {
    ar: `تصفّح تغطية منتجات INCAR لموديلات ${make.displayName}.`,
    en: `Browse INCAR product coverage for ${make.displayName} models.`,
  },
}));

const sampleModels: Model[] = sampleModelRecords.map((model) => ({
  id: model.id,
  slug: model.slug.replace(`${model.brand.toLowerCase()}-`, ""),
  makeId: model.brand.toLowerCase(),
  name: model.displayName,
  status: model.isActive ? "published" : "draft",
  isSampleData: true,
  publishingEligibility: "ineligible",
  content: {
    ar: `ابحث عن منتجات INCAR المناسبة لموديل ${model.displayName} باستخدام رقم القطعة أو رقم OEM.`,
    en: `Search INCAR products for ${model.displayName} by Part Number or OEM Reference.`,
  },
}));

const sampleCategories: Category[] = sampleCategoryRecords.map((category) => ({
  id: category.id,
  slug: category.slug,
  name: category.name,
  localizedName: { ar: category.displayName, en: category.displayName },
  status: category.isActive ? "published" : "draft",
  isSampleData: true,
}));

const sampleProducts: Product[] = sampleProductRecords.map((record) => {
  const relationships = record.compatibility.flatMap((fitment) => {
    const makeId = fitment.brand.toLowerCase();
    const model = sampleModels.find(
      (candidate) =>
        candidate.makeId === makeId && candidate.name === fitment.model,
    );

    return model
      ? [{ makeId, modelId: model.id, compatibilityStatus: "not-verified" as const }]
      : [];
  });

  return {
    internalProductId: record.id,
    slug: record.slug,
    name: { ar: record.name, en: record.name },
    status: record.status === "active" ? "published" : "draft",
    isSampleData: true,
    references: {
      incarPartNumber: record.partNumber,
      oemReferences: [record.oemNumber],
      verifiedAlternateReferences: [],
    },
    vehicleRelationships: relationships,
    category: record.category,
    compatibilityStatus: "not-verified",
    requestEligibility: "verification-required",
    image: record.imageUrl ? { src: record.imageUrl } : null,
    dataVerificationState: "unverified",
    possibleReferenceCandidates: [],
    hasCriticalDataConflict: relationships.length === 0,
  } satisfies Product;
});

function visibleMakes() {
  return [...productionMakes, ...(sampleDataEnabled ? sampleMakes : [])].filter(
    (make) => make.status === "published",
  );
}

function visibleModels() {
  return [...productionModels, ...(sampleDataEnabled ? sampleModels : [])].filter(
    (model) => model.status === "published",
  );
}

function visibleCategories() {
  return [
    ...productionCategories,
    ...(sampleDataEnabled ? sampleCategories : []),
  ].filter((category) => category.status === "published");
}

function visibleProducts() {
  return [
    ...productionProducts,
    ...(sampleDataEnabled ? sampleProducts : []),
  ].filter(isProductPublishingEligible);
}

function withModelEligibility(model: Model, products = visibleProducts()): Model {
  return {
    ...model,
    publishingEligibility: isModelPageEligible(model, products)
      ? "eligible"
      : "ineligible",
  };
}

function withMakeEligibility(
  make: Make,
  models = visibleModels(),
  products = visibleProducts(),
): Make {
  return {
    ...make,
    publishingEligibility: isMakePageEligible(make, models, products)
      ? "eligible"
      : "ineligible",
  };
}

export function normalizeReference(value: string) {
  return normalizeCatalogReference(value);
}

export function getPublishedMakes() {
  const models = visibleModels();
  const products = visibleProducts();
  return visibleMakes()
    .map((make) => withMakeEligibility(make, models, products))
    .filter((make) => make.publishingEligibility === "eligible");
}

export function getPublishedMakeBySlug(slug: string) {
  return getPublishedMakes().find((make) => make.slug === slug);
}

export function getEligibleModelsForMake(makeIdOrSlug: string) {
  const make = visibleMakes().find(
    (candidate) => candidate.id === makeIdOrSlug || candidate.slug === makeIdOrSlug,
  );
  if (!make) return [];

  const products = visibleProducts();
  return visibleModels()
    .filter((model) => model.makeId === make.id)
    .map((model) => withModelEligibility(model, products))
    .filter((model) => model.publishingEligibility === "eligible");
}

export function getEligibleModelBySlug(makeSlug: string, modelSlug: string) {
  const make = getPublishedMakeBySlug(makeSlug);
  if (!make) return undefined;
  return getEligibleModelsForMake(make.id).find((model) => model.slug === modelSlug);
}

export function getPublishedProducts() {
  return visibleProducts();
}

export function getPublishedProductBySlug(slug: string) {
  return visibleProducts().find((product) => product.slug === slug);
}

export function getPublishedProductById(internalProductId: string) {
  return visibleProducts().find(
    (product) => product.internalProductId === internalProductId,
  );
}

export function getProductsForModel(makeSlug: string, modelSlug: string) {
  const make = getPublishedMakeBySlug(makeSlug);
  const model = getEligibleModelBySlug(makeSlug, modelSlug);
  if (!make || !model) return [];

  return visibleProducts().filter((product) =>
    product.vehicleRelationships.some(
      (relationship) =>
        relationship.makeId === make.id && relationship.modelId === model.id,
    ),
  );
}

export function getCategoriesForModel(makeSlug: string, modelSlug: string) {
  const productCategories = new Set(
    getProductsForModel(makeSlug, modelSlug).map((product) => product.category),
  );
  return visibleCategories().filter((category) =>
    productCategories.has(category.name),
  );
}

export function getMakeById(makeId: string) {
  return visibleMakes().find((make) => make.id === makeId);
}

export function getModelById(modelId: string) {
  return visibleModels().find((model) => model.id === modelId);
}

function productMatchesContext(product: Product, context: DiscoverySearchContext) {
  if (!context.makeSlug && !context.modelSlug) return true;
  const make = context.makeSlug ? getPublishedMakeBySlug(context.makeSlug) : undefined;
  const model =
    context.makeSlug && context.modelSlug
      ? getEligibleModelBySlug(context.makeSlug, context.modelSlug)
      : undefined;
  if (context.makeSlug && !make) return false;
  if (context.modelSlug && !model) return false;

  return product.vehicleRelationships.some(
    (relationship) =>
      (!make || relationship.makeId === make.id) &&
      (!model || relationship.modelId === model.id),
  );
}

export function searchProductsByReference(
  originalQuery: string,
  context: DiscoverySearchContext = {},
  locale?: Locale,
): DiscoverySearchResult {
  void locale;
  const normalizedQuery = normalizeReference(originalQuery);
  const emptyResult: DiscoverySearchResult = {
    status: "none",
    originalQuery,
    normalizedQuery,
    referenceMatch: "none",
    exactMatches: [],
    possibleMatches: [],
  };
  if (!normalizedQuery) return emptyResult;

  try {
    const products = visibleProducts().filter((product) =>
      productMatchesContext(product, context),
    );
    const exactMatches: ProductReferenceMatch[] = [];
    const possibleMatches: ProductReferenceMatch[] = [];

    for (const product of products) {
      const documentedReferences = [
        product.references.incarPartNumber,
        ...product.references.oemReferences,
        ...product.references.verifiedAlternateReferences,
      ].filter((value): value is string => Boolean(value));
      const exactReference = documentedReferences.find(
        (reference) => normalizeReference(reference) === normalizedQuery,
      );
      if (exactReference) {
        exactMatches.push({ product, referenceMatch: "exact", matchedReference: exactReference });
        continue;
      }

      const declaredCandidate = product.possibleReferenceCandidates.find(
        (reference) => normalizeReference(reference) === normalizedQuery,
      );
      if (declaredCandidate) {
        possibleMatches.push({
          product,
          referenceMatch: "possible",
          matchedReference: declaredCandidate,
        });
      }
    }

    if (exactMatches.length || possibleMatches.length) {
      return {
        status: "success",
        originalQuery,
        normalizedQuery,
        referenceMatch: exactMatches.length ? "exact" : "possible",
        exactMatches,
        possibleMatches,
      };
    }
    return emptyResult;
  } catch {
    return { ...emptyResult, status: "error" };
  }
}

export function getIndexedMakes() {
  return getPublishedMakes().filter((make) => !make.isSampleData);
}

export function getIndexedModelsForMake(makeIdOrSlug: string) {
  const products = visibleProducts();
  return getEligibleModelsForMake(makeIdOrSlug).filter((model) =>
    isModelIndexEligible(model, products),
  );
}

export function getIndexedProducts() {
  return visibleProducts().filter(isProductIndexEligible);
}

export const discoveryRecordPartitions = {
  production: {
    makes: productionMakes.length,
    models: productionModels.length,
    categories: productionCategories.length,
    products: productionProducts.length,
  },
  sampleEnabled: sampleDataEnabled,
  drafts: {
    makes: draftMakes.length,
    models: draftModels.length,
    products: draftProducts.length,
  },
};
