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
  makes: Map<string, MakeIntake>,
  models: Map<string, ModelIntake>,
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
      (relationship) => {
        const makeId = relationship.makeId.trim();
        const modelId = relationship.modelId.trim();
        const make = makes.get(makeId);
        const model = models.get(modelId);
        return {
          makeId,
          modelId,
          // Only denormalize the name when the make/model is still published —
          // matches the old getMakeById/getModelById lookups' published-only
          // filtering, so an archived make/model falls back to the caller's
          // default label instead of leaking its name onto a still-published
          // product or a filter match that no longer has a visible option.
          makeName: make?.status === "published" ? make.nameEn.trim() : undefined,
          modelName: model?.status === "published" ? model.nameEn.trim() : undefined,
          compatibilityStatus: relationship.compatibilityStatus,
          verifiedYearRanges: relationship.verifiedYearRanges,
        };
      },
    ),
    category: category?.nameEn.trim() ?? "",
    compatibilityStatus: record.compatibilityStatus,
    requestEligibility: record.requestEligibility,
    images: (record.images ?? []).map((image) => ({
      src: image.src.trim(),
      alt:
        image.altAr || image.altEn
          ? {
              ...(image.altAr ? { ar: image.altAr.trim() } : {}),
              ...(image.altEn ? { en: image.altEn.trim() } : {}),
            }
          : undefined,
    })),
    specifications: record.specifications,
    dataVerificationState: record.dataVerificationState,
    possibleReferenceCandidates: [],
    hasCriticalDataConflict: false,
  };
}

export function mapCatalogIntake(catalog: CatalogIntake): CatalogDomainData {
  const categories = new Map(catalog.categories.map((item) => [item.id.trim(), item]));
  const makes = new Map(catalog.makes.map((item) => [item.id.trim(), item]));
  const models = new Map(catalog.models.map((item) => [item.id.trim(), item]));

  return {
    makes: catalog.makes.map(mapMake),
    models: catalog.models.map(mapModel),
    categories: catalog.categories.map(mapCategory),
    products: catalog.products.map((product) => mapProduct(product, categories, makes, models)),
  };
}
