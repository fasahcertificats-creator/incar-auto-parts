import { CatalogExplorer } from "@/components/CatalogExplorer";
import { CatalogRequestForm } from "@/components/CatalogRequestForm";
import { FinalCTA } from "@/components/FinalCTA";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getTrustPillarsBySlug } from "@/data/trust";
import { TrustProofPoints } from "@/features/trust/components";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Catalogs",
  "Request Toyota, Hyundai, private label, and bulk RFQ catalog material for Saudi wholesale auto parts sourcing.",
);

export default function CatalogsPage() {
  const catalogIncludes = [
    "Product photos",
    "Part numbers",
    "OEM numbers",
    "MOQ",
    "Specifications",
    "Compatibility notes",
    "Private Label availability",
  ];
  const catalogTrustPillars = getTrustPillarsBySlug([
    "saudi-market-focus",
    "packaging-control",
    "quality-inspection-system",
    "china-advantage",
  ]);

  return (
    <>
      <PageHero
        eyebrow="Catalogs"
        title="Request catalog material for wholesale sourcing teams"
        description="Catalogs are a qualified B2B lead path for Saudi purchasing teams reviewing Toyota, Hyundai, Private Label, or bulk RFQ sourcing options."
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CatalogExplorer />
        </div>
      </section>
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Catalog trust support"
            title="Catalog requests help qualify the right sourcing conversation."
            description="INCAR uses catalog interest to understand product families, part numbers, MOQ expectations, compatibility notes, and Private Label needs before sending relevant catalog information."
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
              eyebrow="Lead path"
              title="Request the right catalog package before quotation."
              description="INCAR reviews catalog requests so the follow-up can match your brand, category, vehicle model, MOQ, and Private Label interest."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {catalogIncludes.map((item) => (
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
        eyebrow="Qualified catalog request"
        title="Tell us which catalog package your purchasing team needs."
        primaryHref="/catalogs#catalog-request"
        primaryLabel="Request Catalog"
        secondaryHref="/contact"
        secondaryLabel="Sourcing Request"
      />
    </>
  );
}
