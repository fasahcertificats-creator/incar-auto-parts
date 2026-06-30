import { CatalogExplorer } from "@/components/CatalogExplorer";
import { CatalogRequestForm } from "@/components/CatalogRequestForm";
import { FinalCTA } from "@/components/FinalCTA";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getTrustPillarsBySlug } from "@/data/trust";
import { TrustProofPoints } from "@/features/trust/components";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Catalogs",
  "Request Toyota, Hyundai, private label, and bulk RFQ catalog material for Saudi wholesale auto parts sourcing.",
);

export default async function CatalogsPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const catalogTrustPillars = getTrustPillarsBySlug([
    "saudi-market-focus",
    "packaging-control",
    "quality-inspection-system",
    "china-advantage",
  ], locale);

  return (
    <>
      <PageHero
        eyebrow={dictionary.pages.catalogs.eyebrow}
        title={dictionary.pages.catalogs.title}
        description={dictionary.pages.catalogs.description}
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CatalogExplorer />
        </div>
      </section>
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.catalogs.trustEyebrow}
            title={dictionary.pages.catalogs.trustTitle}
            description={dictionary.pages.catalogs.trustDescription}
          />
          <div className="mt-10">
            <TrustProofPoints pillars={catalogTrustPillars} />
          </div>
        </div>
      </section>
      <section
        id="catalog-request"
        className="bg-background px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionHeader
              eyebrow={dictionary.pages.catalogs.leadEyebrow}
              title={dictionary.pages.catalogs.leadTitle}
              description={dictionary.pages.catalogs.leadDescription}
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {dictionary.pages.catalogs.includes.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-border bg-background p-4"
                >
                  <p className="text-sm font-semibold text-metallic-silver">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <CatalogRequestForm />
        </div>
      </section>
      <FinalCTA
        eyebrow={dictionary.pages.catalogs.finalEyebrow}
        title={dictionary.pages.catalogs.finalTitle}
        primaryHref="/catalogs#catalog-request"
        primaryLabel={dictionary.common.requestCatalog}
        secondaryHref="/contact"
        secondaryLabel={dictionary.common.sourcingRequest}
      />
    </>
  );
}
