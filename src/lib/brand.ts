export const BRAND_NAME = "INCAR AUTO PARTS";
export const BRAND_SHORT_NAME = "INCAR";
export const BRAND_TAGLINE =
  "B2B Auto Parts Supplier for Middle Eastern Markets";
export const BRAND_POSITIONING =
  "Specialized Auto Parts Supplier from China for the Middle East";
export const BRAND_DESCRIPTION =
  "INCAR is a specialized B2B auto parts supplier serving wholesalers and importers across the Middle East from China.";

export const brand = {
  name: BRAND_NAME,
  shortName: BRAND_SHORT_NAME,
  tagline: BRAND_TAGLINE,
  positioning: BRAND_POSITIONING,
  description: BRAND_DESCRIPTION,
  coreMessage:
    "Customers buy from INCAR: we review requirements, select manufacturing sources internally, issue quotations under our name, and manage production, quality-control, packaging, and supply follow-up.",
  routeFocus: "China-to-Middle East B2B auto parts supply",
  email: "rfq@incarautoparts.com",
  whatsapp: "+86 138 0000 0000",
  office: "Guangzhou, China",
  market: "Middle Eastern markets",
  metadataBase: getSiteUrl().toString().replace(/\/$/, ""),
};
import { getSiteUrl } from "./site-url";
