"use client";

import { useMemo, useState } from "react";
import { getLocalizedCatalogs } from "@/data/catalogs";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { CatalogCard } from "./CatalogCard";

const catalogFilters = ["All", "Toyota", "Hyundai", "Private Label", "General"];

export function CatalogExplorer() {
  const [filter, setFilter] = useState("All");
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const catalogs = useMemo(() => getLocalizedCatalogs(locale), [locale]);

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
    </div>
  );
}
