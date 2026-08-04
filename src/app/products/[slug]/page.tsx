import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToRfqButton } from "@/components/AddToRfqButton";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getActiveProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import type { ProductFitment } from "@/types/product";
import { localizeHref } from "@/i18n/routing";

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

function formatFitmentYears(fitment: ProductFitment, fallback: string) {
  if (!fitment.yearFrom || !fitment.yearTo) {
    return fallback;
  }

  return `${fitment.yearFrom}-${fitment.yearTo}`;
}

export async function generateStaticParams() {
  return getActiveProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return pageMetadata("Product Details");
  }

  return pageMetadata(
    product.name,
    `${product.name}, OEM ${product.oemNumber}, MOQ ${product.moq}, origin China, RFQ sourcing for Saudi wholesale buyers.`,
  );
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  return (
    <>
      <section className="bg-background px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href={localizeHref(locale, "/parts")} className="incar-focus rounded-sm text-sm font-semibold text-metallic-silver hover:text-white">
            {dictionary.pages.products.back}
          </Link>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-metallic-silver/72">
            {dictionary.pages.products.detailDescription}
          </p>
        </div>
      </section>

      <section className="bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            brand={product.brand}
            partNumber={product.partNumber}
          />
          <div className="incar-card rounded-lg p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [dictionary.productLabels.brand, product.brand],
                [dictionary.productLabels.vehicleModel, product.vehicleModel],
                [dictionary.productLabels.category, dictionary.categories[product.category]],
                [dictionary.productLabels.partNumber, product.partNumber],
                [dictionary.productLabels.oemNumber, product.oemNumber],
                [dictionary.productLabels.origin, dictionary.common.china],
                [
                  dictionary.productLabels.dataStatus,
                  product.isSampleData
                    ? dictionary.common.sampleData
                    : dictionary.common.verified,
                ],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-background p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    {label}
                  </p>
                  <p
                    dir={
                      label === dictionary.productLabels.partNumber ||
                      label === dictionary.productLabels.oemNumber
                        ? "ltr"
                        : undefined
                    }
                    className="mt-2 font-semibold text-white"
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white">
                {dictionary.productLabels.compatibleVehicles}
              </h2>
              <div className="mt-3 grid gap-3">
                {product.compatibility.map((fitment) => (
                  <div
                    key={`${fitment.brand}-${fitment.model}-${fitment.yearFrom}-${fitment.yearTo}`}
                    className="rounded-md border border-border px-3 py-3 text-sm text-metallic-silver"
                  >
                    <p className="font-semibold text-white">
                      {fitment.brand} {fitment.model}
                    </p>
                    <p className="mt-1">
                      {formatFitmentYears(
                        fitment,
                        dictionary.pages.products.compatibilityFallback,
                      )}
                    </p>
                    {fitment.generation ? <p className="mt-1">{fitment.generation}</p> : null}
                    {fitment.engineNotes ? (
                      <p className="mt-1">{fitment.engineNotes}</p>
                    ) : null}
                    {fitment.trimNotes ? <p className="mt-1">{fitment.trimNotes}</p> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white">
                {dictionary.productLabels.specifications}
              </h2>
              <dl className="mt-3 grid gap-2 text-sm leading-6 text-muted">
                {Object.entries(product.specifications).map(([label, value]) => (
                  <div key={label} className="grid gap-1 sm:grid-cols-[0.4fr_1fr]">
                    <dt className="font-semibold text-metallic-silver">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-7">
              <AddToRfqButton product={product} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.products.relatedEyebrow}
            title={dictionary.pages.products.relatedTitle}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
