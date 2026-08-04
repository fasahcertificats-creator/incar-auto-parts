import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductImage } from "@/components/ProductImage";
import { DiscoveryBreadcrumbs } from "@/features/discovery/DiscoveryBreadcrumbs";
import { DiscoveryProductAction } from "@/features/discovery/DiscoveryProductAction";
import { isProductIndexEligible } from "@/features/discovery/eligibility";
import {
  getMakeById,
  getModelById,
  getPublishedProductBySlug,
} from "@/features/discovery/repository";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { localizedPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{
    source?: string | string[];
    q?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function safePartsSource(value: string) {
  if (!value.startsWith("/parts")) return "";
  if (value.includes(":") || value.includes("//") || value.includes("#")) return "";
  return value;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getPublishedProductBySlug(slug);
  const dictionary = getDictionary(locale);
  if (!product) notFound();
  const queryState = await searchParams;

  return localizedPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.name[locale],
    description: dictionary.pages.products.detailDescription,
    noindex:
      !isProductIndexEligible(product) ||
      Boolean(firstValue(queryState.source) || firstValue(queryState.q)),
  });
}

export default async function LocalizedProductDetailsPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getPublishedProductBySlug(slug);
  if (!product) notFound();
  const dictionary = getDictionary(locale);
  const copy = dictionary.discovery;
  const relationship = product.vehicleRelationships[0];
  const make = relationship ? getMakeById(relationship.makeId) : undefined;
  const model = relationship ? getModelById(relationship.modelId) : undefined;
  const queryState = await searchParams;
  const source = safePartsSource(firstValue(queryState.source));
  const returnHref = source || "/parts";
  const returnLabel = source.includes("?q=")
    ? copy.product.returnToSearch
    : source.split("/").filter(Boolean).length >= 3
      ? copy.product.returnToModel
      : copy.product.returnToParts;
  const primaryReference =
    product.references.incarPartNumber ?? product.references.oemReferences[0] ?? "—";

  return (
    <>
      <section className="bg-background px-4 pb-10 pt-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <DiscoveryBreadcrumbs
            locale={locale}
            items={[
              { label: copy.breadcrumbs.home, href: "/" },
              { label: copy.breadcrumbs.parts, href: "/parts" },
              { label: product.name[locale] },
            ]}
          />
          {product.isSampleData ? (
            <p className="mt-8 rounded-sm border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-semibold text-metallic-silver">
              {copy.product.sampleNotice}
            </p>
          ) : null}
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold md:text-6xl">
            {product.name[locale]}
          </h1>
          <Link
            href={localizeHref(locale, returnHref)}
            className="incar-focus mt-6 inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
          >
            {returnLabel}
          </Link>
        </div>
      </section>

      <section className="bg-surface px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ProductImage
            src={product.image?.src ?? null}
            alt={product.image?.alt?.[locale] ?? product.name[locale]}
            brand={make?.name ?? "INCAR"}
            partNumber={primaryReference}
            noImageLabel={copy.product.noImage}
          />
          <div className="incar-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.product.referencesTitle}</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">INCAR Part Number</dt>
                <dd dir="ltr" className="mt-2 font-semibold text-white">{product.references.incarPartNumber ?? "—"}</dd>
              </div>
              <div className="rounded-md bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">OEM Reference</dt>
                <dd dir="ltr" className="mt-2 font-semibold text-white">{product.references.oemReferences.join(", ") || "—"}</dd>
              </div>
              <div className="rounded-md bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.product.compatibilityTitle}</dt>
                <dd className="mt-2 font-semibold text-white">{copy.product.compatibility[product.compatibilityStatus]}</dd>
              </div>
              <div className="rounded-md bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.product.requestTitle}</dt>
                <dd className="mt-2 font-semibold text-white">{copy.product.request[product.requestEligibility]}</dd>
              </div>
            </dl>
            {make && model ? (
              <p className="mt-5 text-sm text-muted">{make.name} · {model.name}</p>
            ) : null}
            <div className="mt-6"><DiscoveryProductAction product={product} /></div>
          </div>
        </div>
      </section>
    </>
  );
}
