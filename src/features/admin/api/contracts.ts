export type AdminRequestKind = "rfq" | "inquiry";

export type AdminRequestSummary = {
  kind: AdminRequestKind;
  id: string;
  publicReference: string;
  type: string;
  status: string;
  companyName: string;
  contactName: string | null;
  createdAt: string;
};

export type AdminRequestListResponse = {
  items: AdminRequestSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type AdminRfqRequestDetail = {
  kind: "rfq";
  id: string;
  publicReference: string;
  requestType: string;
  requestIntent: string | null;
  locale: string;
  status: string;
  marketCountryCode: string;
  customerNotes: string | null;
  createdAt: string;
  submittedAt: string | null;
  closedAt: string | null;
  contact: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string | null;
    whatsapp: string | null;
    countryCode: string;
    city: string | null;
    businessType: string | null;
    preferredLocale: string;
  } | null;
  items: {
    id: string;
    lineNumber: number;
    partNumber: string | null;
    oemReference: string | null;
    productName: string | null;
    quantity: number;
    unit: string;
    make: string | null;
    model: string | null;
    vehicleYear: number | null;
    customerNotes: string | null;
  }[];
  statusHistory: {
    previousStatus: string | null;
    newStatus: string;
    actorType: string;
    internalNote: string | null;
    changedAt: string;
  }[];
};

export type AdminInquiryDetail = {
  kind: "inquiry";
  id: string;
  publicReference: string;
  type: string;
  status: string;
  locale: string;
  fullName: string;
  companyName: string;
  email: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  message: string | null;
  details: Record<string, unknown>;
  createdAt: string;
  respondedAt: string | null;
  closedAt: string | null;
};

export type AdminRequestDetail = AdminRfqRequestDetail | AdminInquiryDetail;

export type AdminLoginResponse = {
  username: string;
  expiresAt: string;
};

/** RFQ requests only — see rfq/domain/status/request-status-transition.ts
 * on the backend. The transition graph, not this list, is what actually
 * enforces which of these are reachable from a given current status. */
export const ADMIN_RFQ_STATUSES = [
  "submitted",
  "under-review",
  "needs-information",
  "quotation-in-progress",
  "quotation-sent",
  "closed",
  "cancelled",
] as const;

export const ADMIN_INQUIRY_STATUSES = ["received", "in-review", "responded", "closed"] as const;

/** Mirrors incar.business_type on the backend — the RFQ contact
 * classification, reused as the customer category field. */
export const ADMIN_CUSTOMER_BUSINESS_TYPES = [
  "importer",
  "wholesaler",
  "distributor",
  "workshop",
  "retailer",
  "other",
] as const;

export type AdminCustomerSummary = {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  businessType: string | null;
  requestCount: number;
  createdAt: string;
};

export type AdminCustomerListResponse = {
  items: AdminCustomerSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type AdminCustomerDetail = {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  businessType: string | null;
  specialDiscountRate: string | null;
  internalNotes: string | null;
  mergedIntoCustomerId: string | null;
  requestCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminCustomerUpdateInput = {
  businessType: string | null;
  internalNotes: string | null;
  specialDiscountRate: number | null;
};

export type AdminCustomerMergeResponse = {
  survivor: AdminCustomerDetail;
  movedRequestCount: number;
};

export const ADMIN_CATALOG_PUBLISHING_STATUSES = ["draft", "published", "archived"] as const;
export const ADMIN_DATA_VERIFICATION_STATES = [
  "verified",
  "requires-review",
  "unverified",
] as const;
export const ADMIN_REQUEST_ELIGIBILITY_VALUES = [
  "requestable",
  "verification-required",
  "not-currently-requestable",
] as const;
export const ADMIN_COMPATIBILITY_STATUSES = [
  "verified",
  "requires-confirmation",
  "not-verified",
  "not-applicable",
] as const;

export type YearRange = { from: number; to: number };

export type AdminMake = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  status: string;
  modelCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminMakeInput = {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  status: string;
};

export type AdminModel = {
  id: string;
  slug: string;
  makeId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  status: string;
  verifiedYearRanges: YearRange[] | null;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminModelInput = {
  slug: string;
  makeId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  status: string;
  verifiedYearRanges: YearRange[] | null;
};

export type AdminCategory = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  status: string;
  displayOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminCategoryInput = {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  status: string;
};

export type AdminProductImage = {
  id: string;
  url: string;
  altAr: string | null;
  altEn: string | null;
  sortOrder: number;
};

export type AdminProductVehicleRelationship = {
  makeId: string;
  modelId: string;
  compatibilityStatus: string;
  verifiedYearRanges: YearRange[] | null;
};

export type AdminProductSummary = {
  id: string;
  slug: string;
  partNumber: string;
  nameAr: string;
  nameEn: string;
  categoryId: string;
  categoryNameEn: string;
  status: string;
  dataVerificationState: string;
  availableForInstantPurchase: boolean;
  primaryImageUrl: string | null;
  createdAt: string;
};

export type AdminProductListResponse = {
  items: AdminProductSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type AdminProductDetail = {
  id: string;
  slug: string;
  partNumber: string;
  oemReferences: string[];
  verifiedAlternateReferences: string[];
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  categoryId: string;
  specifications: Record<string, { ar?: string; en?: string }> | null;
  compatibilityStatus: string;
  requestEligibility: string;
  requestEligibilityNotes: string | null;
  dataVerificationState: string;
  status: string;
  referencePriceUsd: string | null;
  referencePriceCny: string | null;
  directSalePriceUsd: string | null;
  directSalePriceCny: string | null;
  availableForInstantPurchase: boolean;
  vehicleRelationships: AdminProductVehicleRelationship[];
  images: AdminProductImage[];
  createdAt: string;
  updatedAt: string;
};

export type AdminProductBulkImportRowResult = {
  row: number;
  partNumber: string | null;
  status: "created" | "error";
  productId?: string;
  errors?: string[];
};

export type AdminProductBulkImportSummary = {
  totalRows: number;
  created: number;
  failed: number;
  results: AdminProductBulkImportRowResult[];
};

export type AdminProductInput = {
  slug: string;
  partNumber: string;
  oemReferences: string[];
  verifiedAlternateReferences: string[];
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  categoryId: string;
  specifications: Record<string, { ar?: string; en?: string }> | null;
  compatibilityStatus: string;
  requestEligibility: string;
  requestEligibilityNotes: string | null;
  dataVerificationState: string;
  status: string;
  referencePriceUsd: number | null;
  referencePriceCny: number | null;
  directSalePriceUsd: number | null;
  directSalePriceCny: number | null;
  availableForInstantPurchase: boolean;
  vehicleRelationships: AdminProductVehicleRelationship[];
};
