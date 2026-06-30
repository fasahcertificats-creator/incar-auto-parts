import type { Catalog } from "@/types";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";

export type { Catalog } from "@/types";

export const catalogs: Catalog[] = [
  {
    id: "toyota-fast-moving",
    slug: "toyota-fast-moving-parts-catalog",
    title: "Toyota Fast-Moving Parts Catalog",
    description: "Brake, filter, suspension, engine, and interior SKUs for Saudi wholesale buyers.",
    brand: "Toyota",
    fileType: "PDF",
    updated: "Q2 2026",
    items: "320+ SKUs",
    audience: "Toyota spare parts importers and wholesalers",
  },
  {
    id: "hyundai-fast-moving",
    slug: "hyundai-fast-moving-parts-catalog",
    title: "Hyundai Fast-Moving Parts Catalog",
    description: "High-demand Hyundai replacement parts with MOQ and export packing notes.",
    brand: "Hyundai",
    fileType: "PDF",
    updated: "Q2 2026",
    items: "280+ SKUs",
    audience: "Hyundai and Korean vehicle parts distributors",
  },
  {
    id: "private-label-packaging",
    slug: "private-label-packaging-guide",
    title: "Private Label Packaging Guide",
    description: "Box structures, label options, barcode workflows, and OEM/ODM packaging samples.",
    brand: "Private Label",
    fileType: "PDF",
    updated: "2026",
    items: "Packaging systems",
    audience: "Saudi buyers building owned auto parts brands",
  },
  {
    id: "bulk-rfq-template",
    slug: "bulk-rfq-excel-template",
    title: "Bulk RFQ Excel Template",
    description: "Upload-ready format for part number, OEM number, car model, target quantity, and notes.",
    brand: "General",
    fileType: "Excel",
    updated: "2026",
    items: "RFQ template",
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
