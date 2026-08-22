import { sampleDataEnabled } from "@/config/sample-data";
import { brands as sampleMakeRecords } from "@/data/brands";
import { categories as sampleCategoryRecords } from "@/data/categories";
import { vehicleModels as sampleModelRecords } from "@/data/models";
import { products as sampleProductRecords } from "@/data/products";
import { loadProductionCatalog } from "@/data/production";
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
    const make = sampleMakes.find((candidate) => candidate.id === makeId);

    return model
      ? [
          {
            makeId,
            modelId: model.id,
            makeName: make?.name,
            modelName: model.name,
            compatibilityStatus: "not-verified" as const,
          },
        ]
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
    images: record.imageUrl ? [{ src: record.imageUrl }] : [],
    dataVerificationState: "unverified",
    possibleReferenceCandidates: [],
    hasCriticalDataConflict: relationships.length === 0,
  } satisfies Product;
});

type CatalogData = {
  makes: Make[];
  models: Model[];
  categories: Category[];
  products: Product[];
};

/**
 * The one async entry point everything else in this file awaits.
 * loadProductionCatalog() fetches from the live backend with Next's fetch
 * cache (deduped within a render, revalidated periodically) — was
 * previously a synchronous module-level constant read from catalog.json.
 */
async function getCatalogData(): Promise<CatalogData> {
  const { data } = await loadProductionCatalog();
  return {
    makes: [...data.makes, ...(sampleDataEnabled ? sampleMakes : [])],
    models: [...data.models, ...(sampleDataEnabled ? sampleModels : [])],
    categories: [...data.categories, ...(sampleDataEnabled ? sampleCategories : [])],
    products: [...data.products, ...(sampleDataEnabled ? sampleProducts : [])],
  };
}

async function visibleMakes() {
  const { makes } = await getCatalogData();
  return makes.filter((make) => make.status === "published");
}

async function visibleModels() {
  const { models } = await getCatalogData();
  return models.filter((model) => model.status === "published");
}

async function visibleCategories() {
  const { categories } = await getCatalogData();
  return categories.filter((category) => category.status === "published");
}

async function visibleProducts() {
  const { products } = await getCatalogData();
  return products.filter(isProductPublishingEligible);
}

function withModelEligibility(model: Model, products: Product[]): Model {
  return {
    ...model,
    publishingEligibility: isModelPageEligible(model, products) ? "eligible" : "ineligible",
  };
}

function withMakeEligibility(make: Make, models: Model[], products: Product[]): Make {
  return {
    ...make,
    publishingEligibility: isMakePageEligible(make, models, products) ? "eligible" : "ineligible",
  };
}

export function normalizeReference(value: string) {
  return normalizeCatalogReference(value);
}

export async function getPublishedMakes() {
  const [makes, models, products] = await Promise.all([
    visibleMakes(),
    visibleModels(),
    visibleProducts(),
  ]);
  return makes
    .map((make) => withMakeEligibility(make, models, products))
    .filter((make) => make.publishingEligibility === "eligible");
}

export async function getPublishedMakeBySlug(slug: string) {
  const makes = await getPublishedMakes();
  return makes.find((make) => make.slug === slug);
}

export async function getEligibleModelsForMake(makeIdOrSlug: string) {
  const makes = await visibleMakes();
  const make = makes.find(
    (candidate) => candidate.id === makeIdOrSlug || candidate.slug === makeIdOrSlug,
  );
  if (!make) return [];

  const [models, products] = await Promise.all([visibleModels(), visibleProducts()]);
  return models
    .filter((model) => model.makeId === make.id)
    .map((model) => withModelEligibility(model, products))
    .filter((model) => model.publishingEligibility === "eligible");
}

export async function getEligibleModelBySlug(makeSlug: string, modelSlug: string) {
  const make = await getPublishedMakeBySlug(makeSlug);
  if (!make) return undefined;
  const models = await getEligibleModelsForMake(make.id);
  return models.find((model) => model.slug === modelSlug);
}

export async function getPublishedProducts() {
  return visibleProducts();
}

export async function getPublishedProductBySlug(slug: string) {
  const products = await visibleProducts();
  return products.find((product) => product.slug === slug);
}

export async function getPublishedProductById(internalProductId: string) {
  const products = await visibleProducts();
  return products.find((product) => product.internalProductId === internalProductId);
}

export async function getProductsForModel(makeSlug: string, modelSlug: string) {
  const [make, model] = await Promise.all([
    getPublishedMakeBySlug(makeSlug),
    getEligibleModelBySlug(makeSlug, modelSlug),
  ]);
  if (!make || !model) return [];

  const products = await visibleProducts();
  return products.filter((product) =>
    product.vehicleRelationships.some(
      (relationship) => relationship.makeId === make.id && relationship.modelId === model.id,
    ),
  );
}

export async function getCategoriesForModel(makeSlug: string, modelSlug: string) {
  const [products, categories] = await Promise.all([
    getProductsForModel(makeSlug, modelSlug),
    visibleCategories(),
  ]);
  const productCategories = new Set(products.map((product) => product.category));
  return categories.filter((category) => productCategories.has(category.name));
}

async function productMatchesContext(product: Product, context: DiscoverySearchContext) {
  if (!context.makeSlug && !context.modelSlug) return true;
  const make = context.makeSlug ? await getPublishedMakeBySlug(context.makeSlug) : undefined;
  const model =
    context.makeSlug && context.modelSlug
      ? await getEligibleModelBySlug(context.makeSlug, context.modelSlug)
      : undefined;
  if (context.makeSlug && !make) return false;
  if (context.modelSlug && !model) return false;

  return product.vehicleRelationships.some(
    (relationship) =>
      (!make || relationship.makeId === make.id) &&
      (!model || relationship.modelId === model.id),
  );
}

export async function searchProductsByReference(
  originalQuery: string,
  context: DiscoverySearchContext = {},
  locale?: Locale,
): Promise<DiscoverySearchResult> {
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
    const allProducts = await visibleProducts();
    const matchResults = await Promise.all(
      allProducts.map(async (product) => ({
        product,
        matches: await productMatchesContext(product, context),
      })),
    );
    const products = matchResults.filter((entry) => entry.matches).map((entry) => entry.product);
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

export async function getIndexedMakes() {
  const makes = await getPublishedMakes();
  return makes.filter((make) => !make.isSampleData);
}

export async function getIndexedModelsForMake(makeIdOrSlug: string) {
  const [models, products] = await Promise.all([
    getEligibleModelsForMake(makeIdOrSlug),
    visibleProducts(),
  ]);
  return models.filter((model) => isModelIndexEligible(model, products));
}

export async function getIndexedProducts() {
  const products = await visibleProducts();
  return products.filter(isProductIndexEligible);
}
