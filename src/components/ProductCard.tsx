"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { getMakeById, getModelById } from "@/features/discovery/repository";
import type { Product } from "@/types/product";
import { AddToRfqButton } from "./AddToRfqButton";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const relationship = product.vehicleRelationships[0];
  const make = relationship ? getMakeById(relationship.makeId) : undefined;
  const model = relationship ? getModelById(relationship.modelId) : undefined;
  const primaryReference =
    product.references.incarPartNumber ?? product.references.oemReferences[0] ?? "—";
  const canAddToDraft =
    product.requestEligibility === "requestable" &&
    product.compatibilityStatus === "verified";

  return (
    <article className="incar-card group flex h-full flex-col overflow-hidden rounded-lg transition hover:-translate-y-1 hover:border-metallic-silver/35">
      <Link href={localizeHref(locale, `/products/${product.slug}`)} className="incar-focus block rounded-md">
        <ProductImage
          src={product.image?.src ?? null}
          alt={product.image?.alt?.[locale] ?? product.name[locale]}
          brand={make?.name ?? "INCAR"}
          partNumber={primaryReference}
          noImageLabel={dictionary.discovery.product.noImage}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-sm bg-surface-elevated px-2.5 py-1 text-metallic-silver">
            {make?.name ?? "INCAR"}
          </span>
          <span className="rounded-sm bg-surface-elevated px-2.5 py-1 text-metallic-silver">
            {model?.name ?? dictionary.pages.products.reviewRequired}
          </span>
          <span className="rounded-sm border border-primary/24 bg-primary/10 px-2.5 py-1 text-metallic-silver">
            {dictionary.categories[product.category]}
          </span>
        </div>
        <Link href={localizeHref(locale, `/products/${product.slug}`)} className="incar-focus block rounded-sm">
          <h3 className="text-xl font-semibold text-white group-hover:text-metallic-silver">
            {product.name[locale]}
          </h3>
        </Link>
        <dl className="mt-4 grid gap-2 text-sm text-muted">
          <div className="flex justify-between gap-4">
            <dt>{dictionary.productLabels.partNumber}</dt>
            <dd dir="ltr" className="font-semibold text-white">{product.references.incarPartNumber ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{dictionary.productLabels.oemNumber}</dt>
            <dd dir="ltr" className="font-semibold text-white">{product.references.oemReferences[0] ?? "—"}</dd>
          </div>
        </dl>
        <div className="mt-5 flex-1">
          <p className="text-sm leading-6 text-muted">
            {dictionary.discovery.product.compatibility[product.compatibilityStatus]}
          </p>
        </div>
        <div className="mt-5">
          {canAddToDraft ? (
            <AddToRfqButton product={product} compact />
          ) : (
            <Link
              href={localizeHref(locale, `/products/${product.slug}`)}
              className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
            >
              {dictionary.discovery.search.viewDetails}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
