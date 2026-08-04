import type { Catalog } from "@/types";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";

export type { Catalog } from "@/types";

export const catalogs: Catalog[] = [
  {
    id: "toyota-fast-moving",
    slug: "toyota-fast-moving-parts-catalog",
    title: "Toyota Catalog Development Fixture",
    description: "Development-only catalog structure. No verified Toyota catalog file is published.",
    brand: "Toyota",
    fileType: "PDF",
    updated: "Not published",
    items: "No published file",
    audience: "Toyota spare parts importers and wholesalers",
  },
  {
    id: "hyundai-fast-moving",
    slug: "hyundai-fast-moving-parts-catalog",
    title: "Hyundai Catalog Development Fixture",
    description: "Development-only catalog structure. No verified Hyundai catalog file is published.",
    brand: "Hyundai",
    fileType: "PDF",
    updated: "Not published",
    items: "No published file",
    audience: "Hyundai and Korean vehicle parts distributors",
  },
  {
    id: "private-label-packaging",
    slug: "private-label-packaging-guide",
    title: "Private Label Guide Development Fixture",
    description: "Development-only guide structure. No verified packaging guide file is published.",
    brand: "Private Label",
    fileType: "PDF",
    updated: "Not published",
    items: "No published file",
    audience: "Auto parts wholesalers and importers reviewing private label requirements",
  },
  {
    id: "bulk-rfq-template",
    slug: "bulk-rfq-excel-template",
    title: "Bulk RFQ Template Development Fixture",
    description: "Development-only template structure. No verified downloadable file is published.",
    brand: "General",
    fileType: "Excel",
    updated: "Not published",
    items: "No published file",
    audience: "Purchasing teams submitting multi-SKU RFQs",
  },
];

export function getLocalizedCatalogs(locale: Locale = defaultLocale): Catalog[] {
  const dictionary = getDictionary(locale);

  return catalogs.map((catalog) => {
    const localized = dictionary.catalogs[catalog.id as keyof typeof dictionary.catalogs];

    return {
      ...catalog,
      title: localized.title,
      description: localized.description,
      items: localized.items,
      audience: localized.audience,
    };
  });
}
