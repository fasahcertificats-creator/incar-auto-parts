import type { Catalog } from "@/types";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";

export type { Catalog } from "@/types";

export const catalogs: Catalog[] = [
  {
    id: "toyota-fast-moving",
    slug: "toyota-fast-moving-parts-catalog",
    title: "Toyota Parts Catalog",
    description: "INCAR product coverage for selected Toyota applications will appear here when the catalog is available.",
    brand: "Toyota",
    fileType: "PDF",
    updated: "Coming soon",
    items: "Coming soon",
    audience: "Toyota spare parts importers and wholesalers",
  },
  {
    id: "hyundai-fast-moving",
    slug: "hyundai-fast-moving-parts-catalog",
    title: "Hyundai Parts Catalog",
    description: "INCAR product coverage for selected Hyundai applications will appear here when the catalog is available.",
    brand: "Hyundai",
    fileType: "PDF",
    updated: "Coming soon",
    items: "Coming soon",
    audience: "Hyundai and Korean vehicle parts distributors",
  },
  {
    id: "private-label-packaging",
    slug: "private-label-packaging-guide",
    title: "Private Label Product Guide",
    description: "A guide to product development, packaging, labels, samples, production, and quality inspection.",
    brand: "Private Label",
    fileType: "PDF",
    updated: "Coming soon",
    items: "Coming soon",
    audience: "Auto parts wholesalers and importers reviewing private label requirements",
  },
  {
    id: "bulk-rfq-template",
    slug: "bulk-rfq-excel-template",
    title: "Bulk RFQ Template",
    description: "A structured template for Part Numbers, OEM References, quantities, vehicle details, and notes.",
    brand: "General",
    fileType: "Excel",
    updated: "Coming soon",
    items: "Coming soon",
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
