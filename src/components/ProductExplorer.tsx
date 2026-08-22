"use client";

import { useEffect, useState } from "react";
import {
  filterProducts,
  getActiveBrands,
  getActiveCategories,
  getActiveProducts,
  getActiveVehicleModels,
} from "@/lib/products";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import type { BrandName, Product, ProductCategory } from "@/types/product";
import { ProductCard } from "./ProductCard";

type ProductExplorerProps = {
  fixedBrand?: BrandName;
  initialSearch?: string;
  initialBrand?: BrandName | "All";
  initialModel?: string;
};

// This route is permanently redirected away in next.config.ts (/products,
// /products/toyota, /products/hyundai all redirect to /ar/parts) — kept
// working rather than deleted, but never actually reached by a visitor.
// Client-side fetch-on-mount (rather than awaiting the repository directly
// in render) because filterProducts/getActive* now hit the live backend,
// which a client component can't await inline.
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

  const [activeBrands, setActiveBrands] = useState<Awaited<ReturnType<typeof getActiveBrands>>>([]);
  const [activeCategories, setActiveCategories] = useState<
    Awaited<ReturnType<typeof getActiveCategories>>
  >([]);
  const [hasPublishedProducts, setHasPublishedProducts] = useState(false);
  const [availableModels, setAvailableModels] = useState<
    Awaited<ReturnType<typeof getActiveVehicleModels>>
  >([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getActiveBrands(), getActiveCategories(), getActiveProducts()]).then(
      ([brands, categories, products]) => {
        if (cancelled) return;
        setActiveBrands(brands);
        setActiveCategories(categories);
        setHasPublishedProducts(products.length > 0);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getActiveVehicleModels(fixedBrand ?? (brand === "All" ? undefined : brand)).then((models) => {
      if (!cancelled) setAvailableModels(models);
    });
    return () => {
      cancelled = true;
    };
  }, [brand, fixedBrand]);

  useEffect(() => {
    let cancelled = false;
    filterProducts({ brand: fixedBrand ?? brand, model, category, query: search }).then(
      (products) => {
        if (!cancelled) setFilteredProducts(products);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [brand, category, fixedBrand, model, search]);

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="incar-card grid gap-3 rounded-lg p-4 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <label className="grid gap-2 text-sm font-semibold text-white">
            {dictionary.pages.products.searchLabel}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Part Number / OEM Reference"
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
                  {dictionary.categories[
                    categoryOption.name as keyof typeof dictionary.categories
                  ] ?? categoryOption.name}
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
