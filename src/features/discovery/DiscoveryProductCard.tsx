import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import type { Locale } from "@/i18n/types";
import type { Product, ReferenceMatch } from "@/types/product";
import { DiscoveryProductAction } from "./DiscoveryProductAction";
import { getMakeById, getModelById } from "./repository";

export function DiscoveryProductCard({
  locale,
  product,
  referenceMatch,
  sourceHref,
  vehicleContext,
}: {
  locale: Locale;
  product: Product;
  referenceMatch?: Exclude<ReferenceMatch, "none">;
  sourceHref?: string;
  vehicleContext?: { makeId: string; modelId?: string };
}) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.discovery;
  const relationship = product.vehicleRelationships[0];
  const make = relationship ? getMakeById(relationship.makeId) : undefined;
  const model = relationship ? getModelById(relationship.modelId) : undefined;
  const primaryReference =
    product.references.incarPartNumber ?? product.references.oemReferences[0] ?? "—";
  const query = new URLSearchParams();
  if (sourceHref) query.set("source", sourceHref);
  const detailsHref = `/products/${product.slug}${query.size ? `?${query}` : ""}`;

  return (
    <article className="incar-card flex h-full flex-col overflow-hidden rounded-lg">
      <ProductImage
        src={product.image?.src ?? null}
        alt={product.image?.alt?.[locale] ?? product.name[locale]}
        brand={make?.name ?? "INCAR"}
        partNumber={primaryReference}
        noImageLabel={copy.product.noImage}
      />
      <div className="flex flex-1 flex-col p-5">
        {product.isSampleData ? (
          <p className="mb-3 rounded-sm border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-semibold text-metallic-silver">
            {copy.sampleNotice}
          </p>
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {[make?.name, model?.name].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">{product.name[locale]}</h3>
        <p dir="ltr" className="mt-3 text-sm font-semibold text-metallic-silver">
          {primaryReference}
        </p>
        <dl className="mt-4 grid gap-2 text-sm text-muted">
          <div className="flex justify-between gap-4">
            <dt>{copy.product.compatibilityTitle}</dt>
            <dd className="font-semibold text-white">
              {copy.product.compatibility[product.compatibilityStatus]}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{copy.product.requestTitle}</dt>
            <dd className="font-semibold text-white">
              {copy.product.request[product.requestEligibility]}
            </dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-col gap-2 pt-5">
          {referenceMatch === "possible" ? (
            <p className="text-sm font-semibold text-metallic-silver">
              {copy.search.reviewMatch}
            </p>
          ) : null}
          <DiscoveryProductAction
            product={product}
            referenceMatch={referenceMatch}
            vehicleContext={vehicleContext}
          />
          <Link
            href={localizeHref(locale, detailsHref)}
            className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
          >
            {copy.search.viewDetails}
          </Link>
        </div>
      </div>
    </article>
  );
}
