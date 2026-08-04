"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import type { Product } from "@/types/product";
import { AddToRfqButton } from "./AddToRfqButton";
import { ProductImage } from "./ProductImage";

function formatFitment(product: Product, reviewRequired: string) {
  return product.compatibility
    .slice(0, 2)
    .map((fitment) =>
      fitment.yearFrom && fitment.yearTo
        ? `${fitment.model} ${fitment.yearFrom}-${fitment.yearTo}`
        : `${fitment.model} ${reviewRequired}`,
    )
    .join(", ");
}

export function ProductCard({ product }: { product: Product }) {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  return (
    <article className="incar-card group flex h-full flex-col overflow-hidden rounded-lg transition hover:-translate-y-1 hover:border-metallic-silver/35">
      <Link href={localizeHref(locale, `/products/${product.slug}`)} className="incar-focus block rounded-md">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          brand={product.brand}
          partNumber={product.partNumber}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-sm bg-surface-elevated px-2.5 py-1 text-metallic-silver">
            {product.brand}
          </span>
          <span className="rounded-sm bg-surface-elevated px-2.5 py-1 text-metallic-silver">
            {product.vehicleModel}
          </span>
          <span className="rounded-sm border border-primary/24 bg-primary/10 px-2.5 py-1 text-metallic-silver">
            {dictionary.categories[product.category]}
          </span>
        </div>
        <Link href={localizeHref(locale, `/products/${product.slug}`)} className="incar-focus block rounded-sm">
          <h3 className="text-xl font-semibold text-white group-hover:text-metallic-silver">
            {product.name}
          </h3>
        </Link>
        <dl className="mt-4 grid gap-2 text-sm text-muted">
          <div className="flex justify-between gap-4">
            <dt>{dictionary.productLabels.partNumber}</dt>
            <dd dir="ltr" className="font-semibold text-white">{product.partNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{dictionary.productLabels.oemNumber}</dt>
            <dd dir="ltr" className="font-semibold text-white">{product.oemNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{dictionary.productLabels.origin}</dt>
            <dd className="font-semibold text-white">{dictionary.common.china}</dd>
          </div>
        </dl>
        <div className="mt-5 flex-1">
          <p className="text-sm leading-6 text-muted">
            {dictionary.pages.products.compatibleWith.replace(
              "{fitment}",
              formatFitment(product, dictionary.pages.products.reviewRequired),
            )}
          </p>
        </div>
        <div className="mt-5">
          <AddToRfqButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
