export const BRAND_NAME = "INCAR AUTO PARTS";
export const BRAND_SHORT_NAME = "INCAR";
export const BRAND_TAGLINE =
  "INCAR Auto Parts for Wholesalers & Importers";
export const BRAND_POSITIONING =
  "Specialized Auto Parts Products, Manufacturing & Quality";
export const BRAND_DESCRIPTION =
  "INCAR supplies auto parts products for wholesalers, importers, and distributors across Middle Eastern markets.";

import { getSiteUrl } from "./site-url";

// No confirmed WhatsApp number is configured yet. Until
// NEXT_PUBLIC_WHATSAPP_NUMBER is set to a real, confirmed number, `whatsapp`
// and `whatsappLink` stay undefined so callers can hide the CTA instead of
// showing a placeholder to real visitors.
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || undefined;

export const brand = {
  name: BRAND_NAME,
  shortName: BRAND_SHORT_NAME,
  tagline: BRAND_TAGLINE,
  positioning: BRAND_POSITIONING,
  description: BRAND_DESCRIPTION,
  coreMessage:
    "Search INCAR products by Part Number or OEM Reference, request quantities and quotations, or discuss a Private Label program.",
  routeFocus: "INCAR auto parts products and wholesale quotations",
  email: "rfq@incarautoparts.com",
  whatsapp: whatsappNumber,
  whatsappLink: whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}` : undefined,
  office: "Guangzhou, China",
  market: "Middle Eastern markets",
  metadataBase: getSiteUrl().toString().replace(/\/$/, ""),
};
