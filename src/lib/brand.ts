export const BRAND_NAME = "INCAR AUTO PARTS";
export const BRAND_SHORT_NAME = "INCAR";
export const BRAND_TAGLINE = "Global Automotive Supply & Private Label Solutions";
export const BRAND_POSITIONING =
  "Global Automotive Supply & Private Label Solutions from China to Saudi Arabia";
export const BRAND_DESCRIPTION =
  "China-based automotive sourcing, export, quality inspection, and private label solutions for Saudi wholesale buyers.";

export const brand = {
  name: BRAND_NAME,
  shortName: BRAND_SHORT_NAME,
  tagline: BRAND_TAGLINE,
  positioning: BRAND_POSITIONING,
  description: BRAND_DESCRIPTION,
  coreMessage:
    "We help Saudi wholesale buyers source reliable auto parts directly from China with factory sourcing, quality inspection, private label packaging, and export support.",
  routeFocus: "China-to-Saudi B2B sourcing and export support",
  email: "rfq@incarautoparts.com",
  whatsapp: "+86 138 0000 0000",
  office: "Guangzhou, China",
  market: "Saudi Arabia wholesale buyers",
  metadataBase: getSiteUrl().toString().replace(/\/$/, ""),
};
import { getSiteUrl } from "./site-url";
