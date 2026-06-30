import { CTAButton } from "@/components/CTAButton";
import { PageHero } from "@/components/PageHero";
import { ProductExplorer } from "@/components/ProductExplorer";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "RFQ Product Catalog",
  "Search Toyota and Hyundai wholesale auto parts by part number, OEM number, model, and category for Saudi RFQ sourcing.",
);

export default async function ProductsPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dictionary.pages.products.eyebrow}
        title={dictionary.pages.products.title}
        description={dictionary.pages.products.description}
      />
      <section className="bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 rounded-lg border border-border bg-background p-5 md:flex-row md:items-center">
          <p className="text-sm leading-6 text-metallic-silver">
            {dictionary.pages.products.missing}
          </p>
          <CTAButton href="/contact" variant="secondary" className="shrink-0">
            {dictionary.pages.products.cta}
          </CTAButton>
        </div>
      </section>
      <ProductExplorer />
    </>
  );
}
