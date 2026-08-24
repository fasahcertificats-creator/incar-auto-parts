import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductGallery } from "@/components/ProductGallery";
import { DiscoveryBreadcrumbs } from "@/features/discovery/DiscoveryBreadcrumbs";
import { DiscoveryProductAction } from "@/features/discovery/DiscoveryProductAction";
import { isProductIndexEligible } from "@/features/discovery/eligibility";
import { getPublishedProductBySlug } from "@/features/discovery/repository";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { absoluteSiteUrl } from "@/lib/site-url";
import { localizedPageMetadata } from "@/lib/seo";
import {
  buildProductFaqEntries,
  buildProductFaqJsonLd,
  buildProductJsonLd,
  buildProductMetaDescription,
} from "@/lib/structured-data";

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
  const product = await getPublishedProductBySlug(slug);
  const dictionary = getDictionary(locale);
  if (!product) notFound();
  const queryState = await searchParams;

  return localizedPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.name[locale],
    description: buildProductMetaDescription(product, locale, dictionary),
    image: product.images[0] ? absoluteSiteUrl(product.images[0].src) : undefined,
    noindex:
      !isProductIndexEligible(product) ||
      Boolean(firstValue(queryState.source) || firstValue(queryState.q)),
  });
}

export default async function LocalizedProductDetailsPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getPublishedProductBySlug(slug);
  if (!product) notFound();
  const dictionary = getDictionary(locale);
  const copy = dictionary.discovery;
  const relationship = product.vehicleRelationships[0];
  const make = relationship?.makeName ? { name: relationship.makeName } : undefined;
  const model = relationship?.modelName ? { name: relationship.modelName } : undefined;
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
  const categoryLabel =
    (dictionary.categories as Record<string, string | undefined>)[product.category] ?? product.category;
  const description = product.description?.[locale]?.trim();
  const compatibleVehicles = product.vehicleRelationships.filter(
    (item) => item.makeName && item.modelName,
  );
  const specifications = Object.entries(product.specifications ?? {})
    .map(([key, value]) => ({ key, text: value[locale]?.trim() }))
    .filter((entry): entry is { key: string; text: string } => Boolean(entry.text));
  const faqEntries = buildProductFaqEntries(product, locale, dictionary);
  const productJsonLd = buildProductJsonLd(product, locale);
  const faqJsonLd = faqEntries.length ? buildProductFaqJsonLd(faqEntries) : null;
  const galleryAltFallback = [product.name[locale], categoryLabel, primaryReference !== "—" ? primaryReference : ""]
    .filter(Boolean)
    .join(" — ");

  return (
    <article>
      <JsonLd data={productJsonLd} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
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
          <h1 className="mt-8 max-w-4xl text-3xl font-semibold leading-tight md:text-5xl">
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

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ProductGallery
            images={product.images.map((image) => ({
              src: image.src,
              alt: image.alt?.[locale] ?? galleryAltFallback,
            }))}
            brand={make?.name ?? "INCAR"}
            partNumber={primaryReference}
            noImageLabel={copy.product.noImage}
          />
          <div className="incar-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.product.referencesTitle}</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{dictionary.productLabels.partNumber}</dt>
                <dd dir="ltr" className="mt-2 font-semibold text-white">{product.references.incarPartNumber ?? "—"}</dd>
              </div>
              <div className="rounded-md bg-background p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{dictionary.productLabels.oemNumber}</dt>
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

      {description ? (
        <section className="bg-background px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-semibold text-white">{copy.product.descriptionTitle}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-metallic-silver">{description}</p>
          </div>
        </section>
      ) : null}

      {compatibleVehicles.length ? (
        <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-semibold text-white">{copy.product.compatibleVehiclesTitle}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {compatibleVehicles.map((item, index) => (
                <li
                  key={`${item.makeId}-${item.modelId}-${index}`}
                  className="rounded-md bg-background p-4 text-sm text-white"
                >
                  <span className="font-semibold">{item.makeName} {item.modelName}</span>
                  {item.verifiedYearRanges?.length ? (
                    <span className="mt-1 block text-xs text-muted" dir="ltr">
                      {item.verifiedYearRanges
                        .map((range) => (range.from === range.to ? `${range.from}` : `${range.from}–${range.to}`))
                        .join(", ")}
                    </span>
                  ) : null}
                  <span className="mt-1 block text-xs text-muted">
                    {copy.product.compatibility[item.compatibilityStatus]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {specifications.length ? (
        <section className="bg-background px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-semibold text-white">{copy.product.specificationsTitle}</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {specifications.map((entry) => (
                <div key={entry.key} className="rounded-md bg-surface p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{entry.key}</dt>
                  <dd className="mt-2 font-semibold text-white">{entry.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {faqEntries.length ? (
        <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-semibold text-white">{copy.product.faqTitle}</h2>
            <dl className="mt-5 space-y-5">
              {faqEntries.map((entry) => (
                <div key={entry.question}>
                  <dt className="text-base font-semibold text-white">{entry.question}</dt>
                  <dd className="mt-1 text-sm text-metallic-silver">{entry.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}
    </article>
  );
}
