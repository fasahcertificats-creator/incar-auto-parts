import { CatalogExplorer } from "@/components/CatalogExplorer";
import { FinalCTA } from "@/components/FinalCTA";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Catalogs",
  "Download mock Toyota, Hyundai, private label, and bulk RFQ catalog cards for Saudi wholesale auto parts sourcing.",
);

export default function CatalogsPage() {
  return (
    <>
      <PageHero
        eyebrow="Catalogs"
        title="Catalog requests for wholesale sourcing teams"
        description="Request focused catalog material for Toyota, Hyundai, private label packaging, or bulk RFQ preparation."
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CatalogExplorer />
        </div>
      </section>
      <FinalCTA
        eyebrow="Qualified catalog request"
        title="Tell us which catalog package your purchasing team needs."
        primaryHref="/rfq"
        primaryLabel="Request Catalog"
        secondaryHref="/contact"
        secondaryLabel="Sourcing Request"
      />
    </>
  );
}
