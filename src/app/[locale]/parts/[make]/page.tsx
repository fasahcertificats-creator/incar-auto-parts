import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiscoveryActions } from "@/features/discovery/DiscoveryActions";
import { DiscoveryBreadcrumbs } from "@/features/discovery/DiscoveryBreadcrumbs";
import { DiscoverySearch } from "@/features/discovery/DiscoverySearch";
import {
  getEligibleModelsForMake,
  getPublishedMakeBySlug,
  searchProductsByReference,
} from "@/features/discovery/repository";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { localizedPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; make: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, make: makeSlug } = await params;
  if (!isLocale(locale)) notFound();
  const make = getPublishedMakeBySlug(makeSlug);
  if (!make) notFound();
  const query = firstValue((await searchParams).q);
  const copy = getDictionary(locale).discovery;

  return localizedPageMetadata({
    locale,
    path: `/parts/${make.slug}`,
    title: `${make.name} ${copy.breadcrumbs.parts}`,
    description: make.description?.[locale] ?? copy.make.description,
    noindex: make.isSampleData || Boolean(query),
  });
}

export default async function MakePage({ params, searchParams }: Props) {
  const { locale, make: makeSlug } = await params;
  if (!isLocale(locale)) notFound();
  const make = getPublishedMakeBySlug(makeSlug);
  if (!make) notFound();
  const query = firstValue((await searchParams).q);
  const models = getEligibleModelsForMake(make.id);
  if (!models.length) notFound();
  const dictionary = getDictionary(locale);
  const copy = dictionary.discovery;
  const searchResult = query
    ? searchProductsByReference(query, { makeSlug: make.slug }, locale)
    : undefined;

  return (
    <>
      <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <DiscoveryBreadcrumbs
            locale={locale}
            items={[
              { label: copy.breadcrumbs.home, href: "/" },
              { label: copy.breadcrumbs.parts, href: "/parts" },
              { label: make.name },
            ]}
          />
          {make.isSampleData ? (
            <p className="mt-8 rounded-sm border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-semibold text-metallic-silver">
              {copy.sampleNotice}
            </p>
          ) : null}
          <h1 className="mt-8 text-3xl font-semibold leading-tight md:text-5xl">{make.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-metallic-silver">
            {make.description?.[locale] ?? copy.make.description}
          </p>
        </div>
      </section>

      <DiscoverySearch
        locale={locale}
        action={`/parts/${make.slug}`}
        query={query}
        result={searchResult}
        context={{ makeSlug: make.slug }}
        label={copy.make.searchLabel}
      />

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-white">{copy.make.modelsTitle}</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <Link
                key={model.id}
                href={localizeHref(locale, `/parts/${make.slug}/${model.slug}`)}
                className="incar-card incar-focus rounded-lg p-5 text-xl font-semibold text-white hover:border-metallic-silver/40"
              >
                {model.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-border bg-background p-6">
            <h2 className="text-xl font-semibold text-white">{copy.make.partialCoverageTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{copy.make.partialCoverageDescription}</p>
          </div>
        </div>
      </section>

      <DiscoveryActions locale={locale} />
    </>
  );
}
