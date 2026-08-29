/**
 * Hand-written types mirroring the backend's exact response shapes — see
 * D:\in car\incar-backend\src\modules\orders\http\responses\orders.responses.ts
 * and \src\modules\catalog\http\controllers\public-catalog.controller.ts.
 * No OpenAPI generation in this codebase; this file is the single source of
 * truth for the storefront cart/checkout/orders API shapes.
 */

export type OrderStatus =
  | "awaiting-payment-review"
  | "payment-confirmed"
  | "payment-rejected"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * The public product-detail shape, extended with two fields present ONLY
 * when the product is eligible for instant purchase — absent (not
 * null/false) otherwise, per the backend contract. Callers must check
 * `"availableForInstantPurchase" in product` rather than trusting a default.
 */
export type ProductDetailResponse = {
  slug: string;
  directSalePriceUsd?: string;
  availableForInstantPurchase?: true;
  [key: string]: unknown;
};

export type OrderLineItemResponse = {
  id: string;
  productId: string;
  nameAr: string;
  nameEn: string;
  partNumber: string;
  quantity: number;
  unitPriceUsd: string;
  sortOrder: number;
};

export type PublicOrderResponse = {
  id: string;
  publicReference: string;
  status: OrderStatus;
  currency: "USD";
  subtotalUsd: string;
  totalUsd: string;
  contactName: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  country: string;
  postalCode: string | null;
  customerNotes: string | null;
  lineItems: OrderLineItemResponse[];
  createdAt: string;
};

export type OrderLookupResponse = { found: false } | { found: true; order: PublicOrderResponse };

export type BankDetailsResponse = {
  available: boolean;
  bankName: string | null;
  accountNumber: string | null;
  iban: string | null;
  swift: string | null;
  accountHolder: string | null;
};

export type OrderContactInput = {
  contactName: string;
  phone: string;
  whatsapp?: string | null;
  email: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  country: string;
  postalCode?: string | null;
  customerNotes?: string | null;
};

export type OrderCartItemInput = { productId: string; quantity: number };
