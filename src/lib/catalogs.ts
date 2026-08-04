import { getLocalizedCatalogs } from "@/data/catalogs";
import { sampleDataEnabled } from "@/config/sample-data";
import type { Locale } from "@/i18n/types";

export function getPublishedCatalogs(locale: Locale) {
  return sampleDataEnabled ? getLocalizedCatalogs(locale) : [];
}
