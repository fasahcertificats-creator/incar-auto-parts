import type {
  CompatibilityStatus,
  DataVerificationState,
  PublishingStatus,
  RequestEligibility,
  VerifiedYearRange,
} from "../../types/product.ts";

export type CatalogProvenance = {
  sourceName?: string;
  sourceReference?: string;
  sourceRecordId?: string;
  verifiedAt?: string;
  verificationNotes?: string;
};

export type MakeIntake = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  status: PublishingStatus;
  isSampleData: boolean;
  descriptionAr?: string;
  descriptionEn?: string;
  provenance?: CatalogProvenance;
};

export type ModelIntake = {
  id: string;
  slug: string;
  makeId: string;
  nameAr: string;
  nameEn: string;
  status: PublishingStatus;
  isSampleData: boolean;
  descriptionAr?: string;
  descriptionEn?: string;
  verifiedYearRanges?: VerifiedYearRange[];
  provenance?: CatalogProvenance;
};

export type CategoryIntake = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  status: PublishingStatus;
  descriptionAr?: string;
  descriptionEn?: string;
  provenance?: CatalogProvenance;
};

export type ProductReferenceIntake = {
  incarPartNumber?: string;
  oemReferences?: string[];
  verifiedAlternateReferences?: string[];
};

export type VehicleRelationshipIntake = {
  makeId: string;
  modelId: string;
  compatibilityStatus: CompatibilityStatus;
  verifiedYearRanges?: VerifiedYearRange[];
};

export type ProductImageIntake = {
  src: string;
  altAr?: string;
  altEn?: string;
};

export type ProductSpecificationIntake = {
  ar?: string;
  en?: string;
};

export type ProductIntake = {
  internalProductId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  publishingStatus: PublishingStatus;
  isSampleData: boolean;
  dataVerificationState: DataVerificationState;
  compatibilityStatus: CompatibilityStatus;
  requestEligibility: RequestEligibility;
  requestEligibilityNotes?: string;
  categoryId: string;
  references: ProductReferenceIntake;
  vehicleRelationships?: VehicleRelationshipIntake[];
  descriptionAr?: string;
  descriptionEn?: string;
  image?: ProductImageIntake;
  specifications?: Record<string, ProductSpecificationIntake>;
  provenance?: CatalogProvenance;
};

export type CatalogIntake = {
  makes: MakeIntake[];
  models: ModelIntake[];
  categories: CategoryIntake[];
  products: ProductIntake[];
};
