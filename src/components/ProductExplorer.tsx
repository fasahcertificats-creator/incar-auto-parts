"use client";

import { useMemo, useState } from "react";
import {
  filterProducts,
  getActiveBrands,
  getActiveCategories,
  getActiveProducts,
  getActiveVehicleModels,
} from "@/lib/products";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import type { BrandName, ProductCategory } from "@/types/product";
import { ProductCard } from "./ProductCard";

type ProductExplorerProps = {
  fixedBrand?: BrandName;
  initialSearch?: string;
  initialBrand?: BrandName | "All";
  initialModel?: string;
};

export function ProductExplorer({
  fixedBrand,
  initialSearch = "",
  initialBrand = "All",
  initialModel = "All",
}: ProductExplorerProps) {
  const [search, setSearch] = useState(initialSearch);
  const [brand, setBrand] = useState<BrandName | "All">(
    fixedBrand ?? initialBrand,
  );
  const [model, setModel] = useState(initialModel);
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  const activeBrands = getActiveBrands();
  const activeCategories = getActiveCategories();
  const hasPublishedProducts = getActiveProducts().length > 0;

  const availableModels = fixedBrand
    ? getActiveVehicleModels(fixedBrand)
    : brand === "All"
      ? getActiveVehicleModels()
      : getActiveVehicleModels(brand);

  const filteredProducts = useMemo(() => {
    return filterProducts({
      brand: fixedBrand ?? brand,
      model,
      category,
      query: search,
    });
  }, [brand, category, fixedBrand, model, search]);

  return (
    <section className="bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="incar-card grid gap-3 rounded-lg p-4 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <label className="grid gap-2 text-sm font-semibold text-white">
            {dictionary.pages.products.searchLabel}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Part Number / OEM"
              dir="ltr"
              className="incar-input px-4 text-sm font-normal"
            />
          </label>

          {!fixedBrand ? (
            <label className="grid gap-2 text-sm font-semibold text-white">
              {dictionary.pages.products.brandLabel}
              <select
                value={brand}
                onChange={(event) => {
                  setBrand(event.target.value as BrandName | "All");
                  setModel("All");
                }}
                className="incar-input px-4 text-sm font-normal"
              >
                <option value="All">{dictionary.common.all}</option>
                {activeBrands.map((brandOption) => (
                  <option key={brandOption.id} value={brandOption.name}>
                    {brandOption.displayName}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="grid gap-2 text-sm font-semibold text-white">
            {dictionary.pages.products.modelLabel}
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="incar-input px-4 text-sm font-normal"
            >
              <option value="All">{dictionary.common.all}</option>
              {availableModels.map((modelOption) => (
                <option key={modelOption.id} value={modelOption.name}>
                  {modelOption.displayName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-white">
            {dictionary.pages.products.categoryLabel}
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as ProductCategory | "All")}
              className="incar-input px-4 text-sm font-normal"
            >
              <option value="All">{dictionary.common.all}</option>
              {activeCategories.map((categoryOption) => (
                <option key={categoryOption.id} value={categoryOption.name}>
                  {dictionary.categories[categoryOption.name]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {hasPublishedProducts ? (
          <p className="mt-6 text-sm text-muted">
            {filteredProducts.length} {dictionary.pages.products.resultSuffix}
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.internalProductId} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-metallic-silver/24 bg-surface p-8 text-center">
            <p className="text-lg font-semibold text-white">
              {hasPublishedProducts
                ? dictionary.pages.products.noProducts
                : dictionary.pages.products.noPublishedProducts}
            </p>
            <p className="mt-2 text-sm text-muted">
              {hasPublishedProducts
                ? dictionary.pages.products.noProductsDescription
                : dictionary.pages.products.noPublishedProductsDescription}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
