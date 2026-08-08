import type { Locale } from "@/i18n/types";

export type ProductRfqRequestIntent = "compatibility-verification" | null;
export type ProductRfqUnit = "pcs" | "sets" | "pairs";
export type ProductRfqItemSource =
  | "manual"
  | "search-result"
  | "product-page"
  | "compatibility-review";

export type ProductRfqPayload = {
  requestType: "product-rfq";
  requestIntent: ProductRfqRequestIntent;
  locale: Locale;
  marketCountryCode: string;
  customerNotes?: string;
  contact: {
    companyName: string;
    contactName: string;
    countryCode: string;
    city?: string;
    businessType?:
      | "importer"
      | "wholesaler"
      | "distributor"
      | "workshop"
      | "retailer"
      | "other";
    email: string;
    phone?: string;
    whatsapp?: string;
    preferredLocale: Locale;
  };
  privacyConsent: { accepted: true };
  items: Array<{
    partNumber?: string;
    oemReference?: string;
    productName?: string;
    productCandidateId?: string;
    quantity: number;
    unit: ProductRfqUnit;
    vehicle?: {
      make?: string;
      model?: string;
      year?: number;
      engine?: string;
      vin?: string;
      frameNumber?: string;
    } | null;
    customerNotes?: string;
    source: ProductRfqItemSource;
    sourceReference?: string;
    sourceContext?: {
      searchQuery?: string;
      searchResultPosition?: number;
      productSlug?: string;
      makeSlug?: string;
      modelSlug?: string;
    } | null;
  }>;
};

export type RfqSubmissionResponse = {
  publicReference: string;
  requestType: "product-rfq";
  requestIntent: ProductRfqRequestIntent;
  status: string;
  submittedAt: string;
};

export type RfqReceiptResponse = RfqSubmissionResponse & { locale: Locale };
