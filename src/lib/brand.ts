export const BRAND_NAME = "INCAR AUTO PARTS";
export const BRAND_SHORT_NAME = "INCAR";
export const BRAND_TAGLINE =
  "INCAR Auto Parts for Wholesalers & Importers";
export const BRAND_POSITIONING =
  "Specialized Auto Parts Products, Manufacturing & Quality";
export const BRAND_DESCRIPTION =
  "INCAR supplies auto parts products for wholesalers, importers, and distributors across Middle Eastern markets.";

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
  whatsapp: "+86 138 0000 0000",
  office: "Guangzhou, China",
  market: "Middle Eastern markets",
  metadataBase: getSiteUrl().toString().replace(/\/$/, ""),
};
import { getSiteUrl } from "./site-url";
