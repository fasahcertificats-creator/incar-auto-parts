export const BRAND_NAME = "INCAR AUTO PARTS";
export const BRAND_SHORT_NAME = "INCAR";
export const BRAND_TAGLINE =
  "Wholesale Auto Parts Sourcing for Middle Eastern Markets";
export const BRAND_POSITIONING =
  "Wholesale Auto Parts Sourcing from China for the Middle East";
export const BRAND_DESCRIPTION =
  "INCAR is a B2B platform supporting auto parts wholesalers and importers across the Middle East with sourcing from China.";

export const brand = {
  name: BRAND_NAME,
  shortName: BRAND_SHORT_NAME,
  tagline: BRAND_TAGLINE,
  positioning: BRAND_POSITIONING,
  description: BRAND_DESCRIPTION,
  coreMessage:
    "INCAR supports auto parts wholesalers and importers across the Middle East with part discovery, bulk request lists, sourcing, and private label coordination from China.",
  routeFocus: "China-to-Middle East B2B auto parts sourcing",
  email: "rfq@incarautoparts.com",
  whatsapp: "+86 138 0000 0000",
  office: "Guangzhou, China",
  market: "Middle Eastern markets",
  metadataBase: getSiteUrl().toString().replace(/\/$/, ""),
};
import { getSiteUrl } from "./site-url";
