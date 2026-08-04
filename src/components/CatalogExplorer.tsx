"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublishedCatalogs } from "@/lib/catalogs";
import { CatalogCard } from "./CatalogCard";

const catalogFilters = ["All", "Toyota", "Hyundai", "Private Label", "General"];

export function CatalogExplorer() {
  const [filter, setFilter] = useState("All");
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const catalogs = useMemo(() => getPublishedCatalogs(locale), [locale]);

  const filteredCatalogs = useMemo(
    () =>
      filter === "All"
        ? catalogs
        : catalogs.filter((catalog) => catalog.brand === filter),
    [catalogs, filter],
  );

  return (
    <div>
      <div className="incar-card flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="grid gap-2 text-sm font-semibold text-white">
          {dictionary.pages.catalogs.explorerLabel}
          <select
            className="incar-input px-4 text-sm font-normal"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            {catalogFilters.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? dictionary.common.all : item}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm leading-6 text-muted">
          {dictionary.pages.catalogs.explorerDescription}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredCatalogs.map((catalog) => (
          <CatalogCard
            key={catalog.id}
            catalog={catalog}
            ctaLabel={dictionary.common.requestCatalog}
          />
        ))}
      </div>
      {filteredCatalogs.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-metallic-silver/24 bg-surface p-8 text-center text-sm leading-7 text-muted">
          {locale === "ar"
            ? "لا توجد كتالوجات منشورة ومعتمدة حاليًا. لن يظهر رابط تنزيل حتى يتوفر ملف حقيقي."
            : "No verified catalogs are published yet. A download link will appear only when a real file is available."}
        </div>
      ) : null}
    </div>
  );
}
