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

export type BulkBusinessType =
  | "importer" | "wholesaler" | "distributor" | "workshop" | "retailer" | "other";

export type BulkUploadDraft = {
  companyName: string;
  contactName: string;
  countryCode: string;
  city: string;
  businessType: BulkBusinessType | "";
  email: string;
  phone: string;
  whatsapp: string;
  customerNotes: string;
  privacyConsent: boolean;
};

export type BulkListMetadata = {
  requestType: "bulk-list";
  requestIntent: null;
  locale: Locale;
  marketCountryCode: string;
  customerNotes?: string;
  contact: {
    companyName: string;
    contactName: string;
    countryCode: string;
    city?: string;
    businessType?: BulkBusinessType;
    email: string;
    phone?: string;
    whatsapp?: string;
    preferredLocale: Locale;
  };
  privacyConsent: { accepted: true };
};

export type BulkFileStatus =
  | "uploaded" | "awaiting-mapping" | "queued" | "processing"
  | "completed" | "completed-with-errors" | "failed" | "cancelled";
export type BulkTargetField =
  | "partNumber" | "oemReference" | "description" | "quantity" | "unit"
  | "make" | "model" | "year" | "engine" | "vin" | "frameNumber" | "notes";

export type BulkSubmissionResponse = {
  publicReference: string;
  requestType: "bulk-list";
  requestIntent: null;
  status: "submitted";
  submittedAt: string;
};

export type BulkInspectionResponse = {
  publicReference: string;
  requestType: "bulk-list";
  fileStatus: BulkFileStatus;
  format: "csv" | "xlsx";
  sheets: Array<{ index: number; name: string | null; state: "visible" | "hidden" | "veryHidden" }>;
  selectedSheet: { index: number; name: string | null; state: "visible" | "hidden" | "veryHidden" };
  headerRowNumber: number;
  headers: Array<{ index: number; display: string }>;
  mappingRequirements: {
    version: 1;
    targetFields: BulkTargetField[];
    identificationFields: Array<"partNumber" | "oemReference" | "description">;
    readOnly: boolean;
  };
};

export type BulkMappingPayload = {
  version: 1;
  sourceSheetIndex: number;
  headerRowNumber: number;
  columns: Array<{ sourceColumn: string; targetField: BulkTargetField }>;
};

export type BulkMappingResponse = {
  publicReference: string;
  fileStatus: BulkFileStatus;
  mappingAccepted: true;
};

export type BulkStatusResponse = {
  publicReference: string;
  requestStatus: string;
  fileStatus: BulkFileStatus;
  processingScope: "parsed-and-validated";
  summary: { totalRows: number; validRows: number; invalidRows: number; processingErrorRows: number };
  pollAfterSeconds: 3 | null;
  failureCode?: "processing-failed";
};
