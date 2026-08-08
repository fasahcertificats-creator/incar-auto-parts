import type { Locale } from "@/i18n/types";
import type { RFQFormData, RFQItem } from "@/types/rfq";
import type { ProductRfqPayload, ProductRfqRequestIntent } from "./contracts.ts";

export type RfqDraftValidationCode =
  | "contact-name"
  | "company-name"
  | "country-code"
  | "email"
  | "items"
  | "item-reference"
  | "quantity"
  | "privacy"
  | "compatibility";

type MapDraftInput = {
  locale: Locale;
  formData: RFQFormData;
  items: RFQItem[];
  requestIntent?: ProductRfqRequestIntent;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const countryCodePattern = /^[A-Za-z]{2}$/u;

export function validateProductRfqDraft({
  formData,
  items,
  requestIntent = null,
}: MapDraftInput): RfqDraftValidationCode[] {
  const errors: RfqDraftValidationCode[] = [];
  if (!formData.fullName.trim()) errors.push("contact-name");
  if (!formData.companyName.trim()) errors.push("company-name");
  if (!countryCodePattern.test(formData.countryCode.trim())) errors.push("country-code");
  if (!emailPattern.test(formData.email.trim())) errors.push("email");
  if (!formData.privacyConsent) errors.push("privacy");
  const hasManualReference = formData.interestedProductsText.trim().length > 0;
  if (items.length === 0 && !hasManualReference) errors.push("items");
  if (items.some((item) => !item.partNumber && !item.oemNumber && !item.productId)) {
    errors.push("item-reference");
  }
  if (items.some((item) => item.quantity < 1 || item.quantity > 999_999)) {
    errors.push("quantity");
  }
  if (items.length === 0 && hasManualReference) {
    const quantity = Number(formData.requestedQuantityText || "1");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999_999) {
      errors.push("quantity");
    }
  }
  if (
    requestIntent === "compatibility-verification" &&
    (items.length !== 1 || !items[0]?.productId)
  ) errors.push("compatibility");
  return [...new Set(errors)];
}
export function mapProductRfqPayload({
  locale,
  formData,
  items,
  requestIntent = null,
}: MapDraftInput): ProductRfqPayload {
  const countryCode = formData.countryCode.trim().toUpperCase();
  const mappedItems: ProductRfqPayload["items"] = items.length
    ? items.map((item) => ({
        ...(item.partNumber ? { partNumber: item.partNumber.trim() } : {}),
        ...(item.oemNumber ? { oemReference: item.oemNumber.trim() } : {}),
        ...(item.productName ? { productName: item.productName.trim() } : {}),
        ...(item.productId ? { productCandidateId: item.productId } : {}),
        quantity: item.quantity,
        unit: "pcs" as const,
        ...(item.vehicleModel ? { vehicle: { make: item.brand, model: item.vehicleModel } } : {}),
        source: requestIntent === "compatibility-verification"
          ? "compatibility-review" as const
          : "product-page" as const,
        sourceReference: item.slug,
        sourceContext: { productSlug: item.slug },
      }))
    : [{
        partNumber: formData.interestedProductsText.trim(),
        quantity: Number(formData.requestedQuantityText || "1"),
        unit: "pcs",
        source: "manual",
      }];

  return {
    requestType: "product-rfq",
    requestIntent,
    locale,
    marketCountryCode: countryCode,
    ...(formData.message.trim() ? { customerNotes: formData.message.trim() } : {}),
    contact: {
      companyName: formData.companyName.trim(),
      contactName: formData.fullName.trim(),
      countryCode,
      ...(formData.city.trim() ? { city: formData.city.trim() } : {}),
      ...(formData.businessType ? { businessType: formData.businessType } : {}),
      email: formData.email.trim(),
      ...(formData.whatsapp.trim() ? { whatsapp: formData.whatsapp.trim() } : {}),
      preferredLocale: locale,
    },
    privacyConsent: { accepted: true },
    items: mappedItems,
  };
}
