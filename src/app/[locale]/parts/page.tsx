import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiscoveryActions } from "@/features/discovery/DiscoveryActions";
import { DiscoveryBreadcrumbs } from "@/features/discovery/DiscoveryBreadcrumbs";
import { DiscoverySearch } from "@/features/discovery/DiscoverySearch";
import {
  getEligibleModelsForMake,
  getPublishedMakes,
  searchProductsByReference,
} from "@/features/discovery/repository";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { localizedPageMetadata } from "@/lib/seo";

type PartsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export async function generateMetadata({ params, searchParams }: PartsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const query = firstValue((await searchParams).q);

  return localizedPageMetadata({
    locale,
    path: "/parts",
    title: dictionary.discovery.parts.title,
    description: dictionary.discovery.parts.description,
    noindex: Boolean(query),
  });
}

export default async function PartsPage({ params, searchParams }: PartsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const query = firstValue((await searchParams).q);
  const makes = getPublishedMakes();
  const searchResult = query
    ? searchProductsByReference(query, {}, locale)
    : undefined;
  const copy = dictionary.discovery;

  return (
    <>
      <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <DiscoveryBreadcrumbs
            locale={locale}
            items={[
              { label: copy.breadcrumbs.home, href: "/" },
              { label: copy.breadcrumbs.parts },
            ]}
          />
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-primary">
            {copy.parts.eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold md:text-6xl">
            {copy.parts.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-metallic-silver">
            {copy.parts.description}
          </p>
        </div>
      </section>

      <DiscoverySearch
        locale={locale}
        action="/parts"
        query={query}
        result={searchResult}
      />

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-white">{copy.parts.browseTitle}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {copy.parts.browseDescription}
          </p>

          {makes.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {makes.map((make) => {
                const models = getEligibleModelsForMake(make.id);
                return (
                  <article key={make.id} className="incar-card rounded-lg p-6">
                    {make.isSampleData ? (
                      <p className="mb-3 text-xs font-semibold text-metallic-silver">
                        {copy.sampleNotice}
                      </p>
                    ) : null}
                    <h3 className="text-2xl font-semibold text-white">{make.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      {models.map((model) => model.name).join(" · ")}
                    </p>
                    <Link
                      href={localizeHref(locale, `/parts/${make.slug}`)}
                      className="incar-focus mt-5 inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
                    >
                      {make.name}
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-7 rounded-lg border border-dashed border-metallic-silver/25 bg-background p-7">
              <h3 className="text-xl font-semibold text-white">{copy.parts.noMakesTitle}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                {copy.parts.noMakesDescription}
              </p>
            </div>
          )}
        </div>
      </section>

      <DiscoveryActions locale={locale} />
    </>
  );
}
