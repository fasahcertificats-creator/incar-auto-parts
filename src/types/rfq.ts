import type { Product, ProductCategory } from "./index";
import type { UploadedRFQFileMeta } from "./upload";

export type RFQStatus = "draft" | "submitted" | "reviewing" | "quoted" | "closed";

export type RFQCustomer = {
  fullName: string;
  companyName: string;
  country: string;
  city: string;
  email: string;
  whatsapp: string;
};

export type RFQItem = {
  productId: string;
  productName: string;
  slug: string;
  brand: string;
  vehicleModel: string;
  category: ProductCategory;
  partNumber: string;
  oemNumber: string;
  quantity: number;
};

export type RFQSubmission = {
  customer: RFQCustomer;
  items: RFQItem[];
  interestedProductsText: string;
  requestedQuantityText: string;
  message: string;
  excelFile: UploadedRFQFileMeta | null;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileExtension: string;
  lastModified: number | null;
  status: RFQStatus;
  createdAt: string;
};

export type RFQFormData = {
  fullName: string;
  companyName: string;
  countryCode: string;
  city: string;
  email: string;
  whatsapp: string;
  businessType:
    | ""
    | "importer"
    | "wholesaler"
    | "distributor"
    | "workshop"
    | "retailer"
    | "other";
  interestedProductsText: string;
  requestedQuantityText: string;
  message: string;
  privacyConsent: boolean;
};

export type RFQProduct = Product;
