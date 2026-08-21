import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinueRfqDraftLink } from "@/features/discovery/ContinueRfqDraftLink";
import { DiscoveryActions } from "@/features/discovery/DiscoveryActions";
import { DiscoveryBreadcrumbs } from "@/features/discovery/DiscoveryBreadcrumbs";
import { DiscoveryProductCard } from "@/features/discovery/DiscoveryProductCard";
import { DiscoverySearch } from "@/features/discovery/DiscoverySearch";
import {
  getCategoriesForModel,
  getEligibleModelBySlug,
  getIndexedModelsForMake,
  getProductsForModel,
  getPublishedMakeBySlug,
  searchProductsByReference,
} from "@/features/discovery/repository";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { localizedPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; make: string; model: string }>;
  searchParams: Promise<{
    q?: string | string[];
    view?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, make: makeSlug, model: modelSlug } = await params;
  if (!isLocale(locale)) notFound();
  const make = getPublishedMakeBySlug(makeSlug);
  const model = getEligibleModelBySlug(makeSlug, modelSlug);
  if (!make || !model) notFound();
  const queryState = await searchParams;
  const query = firstValue(queryState.q);
  const view = firstValue(queryState.view);
  const indexEligible = getIndexedModelsForMake(make.id).some(
    (candidate) => candidate.id === model.id,
  );
  const copy = getDictionary(locale).discovery;

  return localizedPageMetadata({
    locale,
    path: `/parts/${make.slug}/${model.slug}`,
    title: `${make.name} ${model.name} ${copy.breadcrumbs.parts}`,
    description: model.content?.[locale] ?? copy.model.contentFallback,
    noindex: model.isSampleData || !indexEligible || Boolean(query || view),
  });
}

export default async function ModelPage({ params, searchParams }: Props) {
  const { locale, make: makeSlug, model: modelSlug } = await params;
  if (!isLocale(locale)) notFound();
  const make = getPublishedMakeBySlug(makeSlug);
  const model = getEligibleModelBySlug(makeSlug, modelSlug);
  if (!make || !model) notFound();
  const queryState = await searchParams;
  const query = firstValue(queryState.q);
  const showAllProducts = firstValue(queryState.view) === "all";
  const copy = getDictionary(locale).discovery;
  const searchResult = query
    ? searchProductsByReference(query, { makeSlug, modelSlug }, locale)
    : undefined;

  let productSection:
    | { status: "success"; products: ReturnType<typeof getProductsForModel> }
    | { status: "error"; products: [] };
  try {
    productSection = { status: "success", products: getProductsForModel(makeSlug, modelSlug) };
  } catch {
    productSection = { status: "error", products: [] };
  }
  const categories = getCategoriesForModel(makeSlug, modelSlug);

  return (
    <>
      <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <DiscoveryBreadcrumbs
            locale={locale}
            items={[
              { label: copy.breadcrumbs.home, href: "/" },
              { label: copy.breadcrumbs.parts, href: "/parts" },
              { label: make.name, href: `/parts/${make.slug}` },
              { label: model.name },
            ]}
          />
          {model.isSampleData ? (
            <p className="mt-8 rounded-sm border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-semibold text-metallic-silver">
              {copy.sampleNotice}
            </p>
          ) : null}
          <h1 className="mt-8 text-4xl font-semibold md:text-6xl">
            {make.name} {model.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-metallic-silver">
            {model.content?.[locale] ?? copy.model.contentFallback}
          </p>
        </div>
      </section>

      <DiscoverySearch
        locale={locale}
        action={`/parts/${make.slug}/${model.slug}`}
        query={query}
        result={searchResult}
        context={{ makeSlug, modelSlug }}
        label={copy.model.searchLabel}
      />

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {model.verifiedYearRanges?.length ? (
            <div>
              <h2 className="text-2xl font-semibold text-white">{copy.model.yearsTitle}</h2>
              <p dir="ltr" className="mt-3 text-sm text-metallic-silver">
                {model.verifiedYearRanges.map((range) => `${range.from}–${range.to}`).join(", ")}
              </p>
            </div>
          ) : null}

          <div className={model.verifiedYearRanges?.length ? "mt-10" : ""}>
            <h2 className="text-2xl font-semibold text-white">{copy.model.categoriesTitle}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category.id} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-metallic-silver">
                  {category.localizedName[locale]}
                </span>
              ))}
            </div>
          </div>

          <div id="model-products" className="mt-10">
            <h2 className="text-2xl font-semibold text-white">{copy.model.productsTitle}</h2>
            {productSection.status === "error" ? (
              <p className="mt-4 rounded-lg border border-primary/30 bg-background p-5 text-sm text-muted">
                {copy.search.errorDescription}
              </p>
            ) : productSection.products.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-metallic-silver/25 bg-background p-6">
                <h3 className="text-xl font-semibold text-white">
                  {copy.model.noProductsTitle}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                  {copy.model.noProductsDescription}
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {(showAllProducts
                  ? productSection.products
                  : productSection.products.slice(0, 3)
                ).map((product) => (
                  <DiscoveryProductCard
                    key={product.internalProductId}
                    locale={locale}
                    product={product}
                    sourceHref={`/parts/${make.slug}/${model.slug}`}
                    vehicleContext={{ makeId: make.id, modelId: model.id }}
                  />
                ))}
              </div>
            )}
            {productSection.status === "success" &&
            productSection.products.length > 3 &&
            !showAllProducts ? (
              <Link
                href={localizeHref(
                  locale,
                  `/parts/${make.slug}/${model.slug}?view=all#model-products`,
                )}
                className="incar-focus mt-6 inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
              >
                {copy.model.viewAll}
              </Link>
            ) : null}
          </div>

          <div className="mt-10 rounded-lg border border-border bg-background p-6">
            <h2 className="text-xl font-semibold text-white">{copy.model.catalogTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{copy.model.catalogNone}</p>
          </div>

          <div className="mt-6"><ContinueRfqDraftLink /></div>
        </div>
      </section>

      <DiscoveryActions locale={locale} />
    </>
  );
}
