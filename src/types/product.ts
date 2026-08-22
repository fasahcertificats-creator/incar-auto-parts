import type { Locale } from "@/i18n/types";

export type BrandName = string;

export type KnownProductCategory =
  | "Brake System"
  | "Suspension Parts"
  | "Filters"
  | "Engine Parts"
  | "Interior Parts";
export type ProductCategory = KnownProductCategory | (string & {});

export type PublishingStatus = "published" | "draft" | "archived";
export type PublishingEligibility = "eligible" | "ineligible";
export type CompatibilityStatus =
  | "verified"
  | "requires-confirmation"
  | "not-verified"
  | "not-applicable";
export type RequestEligibility =
  | "requestable"
  | "verification-required"
  | "not-currently-requestable";
export type ReferenceMatch = "exact" | "possible" | "none";
export type DataVerificationState = "verified" | "requires-review" | "unverified";
export type LocalizedProductName = Record<Locale, string>;

export type VerifiedYearRange = {
  from: number;
  to: number;
};

export type Make = {
  id: string;
  slug: string;
  name: BrandName;
  localizedName?: LocalizedProductName;
  status: PublishingStatus;
  isSampleData: boolean;
  description?: Partial<Record<Locale, string>>;
  publishingEligibility: PublishingEligibility;
};

export type Model = {
  id: string;
  slug: string;
  makeId: string;
  name: string;
  localizedName?: LocalizedProductName;
  status: PublishingStatus;
  isSampleData: boolean;
  publishingEligibility: PublishingEligibility;
  verifiedYearRanges?: VerifiedYearRange[];
  content?: Partial<Record<Locale, string>>;
};

export type Category = {
  id: string;
  slug: string;
  name: ProductCategory;
  localizedName: LocalizedProductName;
  status: PublishingStatus;
  isSampleData: boolean;
};

export type ProductReferences = {
  incarPartNumber?: string;
  oemReferences: string[];
  verifiedAlternateReferences: string[];
};

export type ProductVehicleRelationship = {
  makeId: string;
  modelId: string;
  /** Resolved once, server-side, when the Product is built — lets
   * client-side code (the RFQ draft cart, card components) display the
   * make/model name synchronously instead of looking it up by ID against
   * data that's now fetched live. */
  makeName?: string;
  modelName?: string;
  compatibilityStatus: CompatibilityStatus;
  verifiedYearRanges?: VerifiedYearRange[];
};

export type ProductImage = {
  src: string;
  alt?: Partial<Record<Locale, string>>;
};

export type Product = {
  internalProductId: string;
  slug: string;
  name: LocalizedProductName;
  description?: Partial<Record<Locale, string>>;
  status: PublishingStatus;
  isSampleData: boolean;
  references: ProductReferences;
  vehicleRelationships: ProductVehicleRelationship[];
  category: ProductCategory;
  compatibilityStatus: CompatibilityStatus;
  requestEligibility: RequestEligibility;
  images: ProductImage[];
  specifications?: Record<string, Partial<Record<Locale, string>>>;
  dataVerificationState: DataVerificationState;
  possibleReferenceCandidates: string[];
  hasCriticalDataConflict: boolean;
};

// Compatibility aliases retained for non-Discovery features while they migrate.
export type Brand = Make;
export type VehicleModel = Model;
export type ProductFitment = ProductVehicleRelationship;
export type ProductStatus = PublishingStatus;
export type ProductOrigin = "China";
