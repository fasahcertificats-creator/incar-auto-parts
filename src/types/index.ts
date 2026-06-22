export type Locale = "en" | "ar";
export type Direction = "ltr" | "rtl";

export type {
  Brand,
  BrandName,
  Category,
  Product,
  ProductCategory,
  ProductFitment,
  ProductOrigin,
  ProductStatus,
  VehicleModel,
} from "./product";
export type {
  PrivateLabelCategory,
  PrivateLabelCategoryDetail,
  PrivateLabelInquiry,
  PrivateLabelInquiryStatus,
  PrivateLabelLogoStatus,
  PrivateLabelProcessStep,
  PrivateLabelService,
  PrivateLabelTrustPoint,
} from "./private-label";
export type { TrustCTA, TrustPillar, TrustProcessStep } from "./trust";

import type { BrandName } from "./product";

export type Catalog = {
  id: string;
  slug: string;
  title: string;
  description: string;
  brand: BrandName | "Private Label" | "General";
  fileType: "PDF" | "Excel";
  updated: string;
  items: string;
  audience: string;
};

export type RFQStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "sourcing"
  | "quoted"
  | "closed";

export type RFQCustomer = {
  fullName: string;
  companyName: string;
  country: string;
  city?: string;
  email: string;
  whatsapp: string;
};

export type RFQItem = {
  id: string;
  productId?: string;
  partNumber: string;
  oemNumber?: string;
  quantity: number;
  notes?: string;
};

export type RFQ = {
  id: string;
  status: RFQStatus;
  customer: RFQCustomer;
  items: RFQItem[];
  message?: string;
  source: "rfq_form" | "product_detail" | "catalog_request" | "whatsapp";
  createdAt: string;
  updatedAt: string;
};

export type RfqItem = RFQItem;
