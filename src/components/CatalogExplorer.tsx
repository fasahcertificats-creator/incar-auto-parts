"use client";

import { useMemo, useState } from "react";
import { catalogs } from "@/data/catalogs";
import { CatalogCard } from "./CatalogCard";

const catalogFilters = ["All", "Toyota", "Hyundai", "Private Label", "General"];

export function CatalogExplorer() {
  const [filter, setFilter] = useState("All");

  const filteredCatalogs = useMemo(
    () =>
      filter === "All"
        ? catalogs
        : catalogs.filter((catalog) => catalog.brand === filter),
    [filter],
  );

  return (
    <div>
      <div className="incar-card flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="grid gap-2 text-sm font-semibold text-white">
          Catalog focus
          <select
            className="incar-input px-4 text-sm font-normal"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            {catalogFilters.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <p className="text-sm leading-6 text-muted">
          Catalog requests can include part numbers, photos, specifications,
          MOQ, compatibility, and packaging notes.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredCatalogs.map((catalog) => (
          <CatalogCard key={catalog.id} catalog={catalog} />
        ))}
      </div>
    </div>
  );
}
