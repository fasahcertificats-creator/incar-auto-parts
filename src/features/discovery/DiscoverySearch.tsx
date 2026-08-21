import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import type { Locale } from "@/i18n/types";
import {
  getEligibleModelBySlug,
  getPublishedMakeBySlug,
  type DiscoverySearchContext,
  type DiscoverySearchResult,
} from "./repository";
import { DiscoveryProductCard } from "./DiscoveryProductCard";
import { DiscoverySearchForm } from "./DiscoverySearchForm";

export function DiscoverySearch({
  locale,
  action,
  query,
  result,
  context,
  label,
}: {
  locale: Locale;
  action: string;
  query: string;
  result?: DiscoverySearchResult;
  context?: DiscoverySearchContext;
  label?: string;
}) {
  const copy = getDictionary(locale).discovery.search;
  const sourceHref = `${action}${query ? `?q=${encodeURIComponent(query)}` : ""}`;
  const contextMake = context?.makeSlug
    ? getPublishedMakeBySlug(context.makeSlug)
    : undefined;
  const contextModel =
    context?.makeSlug && context.modelSlug
      ? getEligibleModelBySlug(context.makeSlug, context.modelSlug)
      : undefined;
  const vehicleContext = contextMake
    ? { makeId: contextMake.id, modelId: contextModel?.id }
    : undefined;

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <DiscoverySearchForm
          action={localizeHref(locale, action)}
          query={query}
          label={label ?? copy.label}
          placeholder={copy.placeholder}
          actionLabel={copy.action}
          loadingLabel={locale === "ar" ? "جارٍ البحث…" : "Searching…"}
        />

        {query && result ? (
          <div className="mt-10">
            <p className="text-sm text-muted">
              {copy.originalQuery}: <bdi dir="ltr" className="font-semibold text-white">{result.originalQuery}</bdi>
            </p>

            {result.status === "error" ? (
              <div className="mt-5 rounded-lg border border-primary/30 bg-surface p-6">
                <h2 className="text-xl font-semibold text-white">{copy.errorTitle}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{copy.errorDescription}</p>
              </div>
            ) : null}

            {result.status === "none" ? (
              <div className="mt-5 rounded-lg border border-dashed border-metallic-silver/25 bg-surface p-7">
                <h2 className="text-xl font-semibold text-white">{copy.noResultsTitle}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{copy.noResultsDescription}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a href="#parts-search" className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white">
                    {copy.modify}
                  </a>
                  <Link href={localizeHref(locale, "/rfq#upload-parts-list")} className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white">
                    {getDictionary(locale).discovery.actions.uploadAction}
                  </Link>
                  <Link href={localizeHref(locale, "/sourcing-services")} className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover">
                    {getDictionary(locale).discovery.actions.sourcingAction}
                  </Link>
                </div>
              </div>
            ) : null}

            {result.exactMatches.length ? (
              <section className="mt-8">
                <h2 className="text-2xl font-semibold text-white">{copy.exactTitle}</h2>
                <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {result.exactMatches.map((match) => (
                    <DiscoveryProductCard key={match.product.internalProductId} locale={locale} product={match.product} referenceMatch="exact" sourceHref={sourceHref} vehicleContext={vehicleContext} />
                  ))}
                </div>
              </section>
            ) : null}

            {result.possibleMatches.length ? (
              <section className="mt-8">
                <h2 className="text-2xl font-semibold text-white">{copy.possibleTitle}</h2>
                <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {result.possibleMatches.map((match) => (
                    <DiscoveryProductCard key={match.product.internalProductId} locale={locale} product={match.product} referenceMatch="possible" sourceHref={sourceHref} vehicleContext={vehicleContext} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
