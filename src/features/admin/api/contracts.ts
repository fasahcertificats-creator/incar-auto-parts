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
