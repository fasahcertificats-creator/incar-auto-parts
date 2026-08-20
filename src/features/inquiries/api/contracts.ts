export type InquiryLocale = "ar" | "en";

export type PrivateLabelLogoStatus = "yes" | "no" | "in_progress";

export type ContactInquiryPayload = {
  type: "contact";
  fullName: string;
  companyName: string;
  email: string;
  whatsapp?: string;
  inquiryType: string;
  message?: string;
  locale: InquiryLocale;
};

export type PrivateLabelInquiryPayload = {
  type: "private-label";
  fullName: string;
  companyName: string;
  country: string;
  city: string;
  email?: string;
  whatsapp?: string;
  brandName: string;
  productCategory: string;
  targetMarket: string;
  estimatedQuantity: string;
  logoStatus: PrivateLabelLogoStatus;
  packagingRequirements?: string;
  message?: string;
  locale: InquiryLocale;
};

export type CatalogRequestInquiryPayload = {
  type: "catalog-request";
  fullName: string;
  companyName: string;
  country?: string;
  city?: string;
  email: string;
  whatsapp?: string;
  catalogInterest: string;
  brand: string;
  vehicleModelOrCategory?: string;
  message?: string;
  locale: InquiryLocale;
};

export type InquiryPayload =
  | ContactInquiryPayload
  | PrivateLabelInquiryPayload
  | CatalogRequestInquiryPayload;

export type InquirySubmissionResponse = {
  publicReference: string;
  type: InquiryPayload["type"];
  status: "received" | "in-review" | "responded" | "closed";
  submittedAt: string;
  locale: InquiryLocale;
};
