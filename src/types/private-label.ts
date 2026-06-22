import type { ProductCategory } from "./product";

export type PrivateLabelCategory = ProductCategory;

export type PrivateLabelLogoStatus = "yes" | "no" | "in_progress";

export type PrivateLabelInquiryStatus = "draft" | "submitted" | "reviewing";

export type PrivateLabelInquiry = {
  fullName: string;
  companyName: string;
  country: string;
  city: string;
  email: string;
  whatsapp: string;
  brandName: string;
  productCategory: PrivateLabelCategory;
  targetMarket: string;
  estimatedQuantity: string;
  logoStatus: PrivateLabelLogoStatus;
  packagingRequirements: string;
  message: string;
  createdAt: string;
  status: PrivateLabelInquiryStatus;
};

export type PrivateLabelService = {
  id: string;
  title: string;
  description: string;
};

export type PrivateLabelProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type PrivateLabelCategoryDetail = {
  category: PrivateLabelCategory;
  description: string;
};

export type PrivateLabelTrustPoint = {
  id: string;
  label: string;
};
