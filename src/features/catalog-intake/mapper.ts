import type {
  CatalogIntake,
  CategoryIntake,
  MakeIntake,
  ModelIntake,
  ProductIntake,
} from "./contracts.ts";
import type { Category, Make, Model, Product } from "../../types/product.ts";

export type CatalogDomainData = {
  makes: Make[];
  models: Model[];
  categories: Category[];
  products: Product[];
};

function localizedDescription(descriptionAr?: string, descriptionEn?: string) {
  if (!descriptionAr && !descriptionEn) return undefined;
  return {
    ...(descriptionAr ? { ar: descriptionAr.trim() } : {}),
    ...(descriptionEn ? { en: descriptionEn.trim() } : {}),
  };
}

function mapMake(record: MakeIntake): Make {
  return {
    id: record.id.trim(),
    slug: record.slug.trim(),
    name: record.nameEn.trim(),
    localizedName: { ar: record.nameAr.trim(), en: record.nameEn.trim() },
    status: record.status,
    isSampleData: false,
    description: localizedDescription(record.descriptionAr, record.descriptionEn),
    publishingEligibility: "ineligible",
  };
}

function mapModel(record: ModelIntake): Model {
  return {
    id: record.id.trim(),
    slug: record.slug.trim(),
    makeId: record.makeId.trim(),
    name: record.nameEn.trim(),
    localizedName: { ar: record.nameAr.trim(), en: record.nameEn.trim() },
    status: record.status,
    isSampleData: false,
    publishingEligibility: "ineligible",
    verifiedYearRanges: record.verifiedYearRanges,
    content: localizedDescription(record.descriptionAr, record.descriptionEn),
  };
}

function mapCategory(record: CategoryIntake): Category {
  return {
    id: record.id.trim(),
    slug: record.slug.trim(),
    name: record.nameEn.trim(),
    localizedName: { ar: record.nameAr.trim(), en: record.nameEn.trim() },
    status: record.status,
    isSampleData: false,
  };
}

function mapProduct(
  record: ProductIntake,
  categories: Map<string, CategoryIntake>,
): Product {
  const category = categories.get(record.categoryId.trim());

  return {
    internalProductId: record.internalProductId.trim(),
    slug: record.slug.trim(),
    name: { ar: record.nameAr.trim(), en: record.nameEn.trim() },
    description: localizedDescription(record.descriptionAr, record.descriptionEn),
    status: record.publishingStatus,
    isSampleData: false,
    references: {
      incarPartNumber: record.references.incarPartNumber,
      oemReferences: record.references.oemReferences ?? [],
      verifiedAlternateReferences:
        record.references.verifiedAlternateReferences ?? [],
    },
    vehicleRelationships: (record.vehicleRelationships ?? []).map(
      (relationship) => ({
        makeId: relationship.makeId.trim(),
        modelId: relationship.modelId.trim(),
        compatibilityStatus: relationship.compatibilityStatus,
        verifiedYearRanges: relationship.verifiedYearRanges,
      }),
    ),
    category: category?.nameEn.trim() ?? "",
    compatibilityStatus: record.compatibilityStatus,
    requestEligibility: record.requestEligibility,
    image: record.image
      ? {
          src: record.image.src.trim(),
          alt:
            record.image.altAr || record.image.altEn
              ? {
                  ...(record.image.altAr
                    ? { ar: record.image.altAr.trim() }
                    : {}),
                  ...(record.image.altEn
                    ? { en: record.image.altEn.trim() }
                    : {}),
                }
              : undefined,
        }
      : null,
    specifications: record.specifications,
    dataVerificationState: record.dataVerificationState,
    possibleReferenceCandidates: [],
    hasCriticalDataConflict: false,
  };
}

export function mapCatalogIntake(catalog: CatalogIntake): CatalogDomainData {
  const categories = new Map(catalog.categories.map((item) => [item.id.trim(), item]));

  return {
    makes: catalog.makes.map(mapMake),
    models: catalog.models.map(mapModel),
    categories: catalog.categories.map(mapCategory),
    products: catalog.products.map((product) => mapProduct(product, categories)),
  };
}
