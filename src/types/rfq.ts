import type { BrandName, Product, ProductCategory } from "./index";
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
  brand: BrandName;
  vehicleModel: string;
  category: ProductCategory;
  partNumber: string;
  oemNumber: string;
  quantity: number;
  moq: number;
  privateLabelAvailable: boolean;
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
  country: string;
  city: string;
  email: string;
  whatsapp: string;
  interestedProductsText: string;
  requestedQuantityText: string;
  message: string;
  excelFile: UploadedRFQFileMeta | null;
};

export type RFQProduct = Product;
