import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getTrustPillarsBySlug, trustProcessSteps } from "@/data/trust";
import {
  TrustFinalCTA,
  TrustPillarsGrid,
  TrustProcess,
  TrustProofPoints,
} from "@/features/trust/components";
import { pageMetadata } from "@/lib/seo";

const qualityControlPillars = getTrustPillarsBySlug([
  "quality-inspection-system",
  "factory-verification",
  "packaging-control",
  "export-documentation",
]);

export const metadata = pageMetadata(
  "Quality Control and Trust System",
  "INCAR quality inspection, supplier review, packaging control, and export documentation support for Saudi wholesale auto parts buyers.",
);

export default function QualityControlPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality control"
        title="Inspection, supplier review, packaging control, and export support."
        description="INCAR helps Saudi wholesale buyers review sourcing details before production and export coordination, using practical checkpoints rather than unsupported claims."
        align="left"
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Trust foundation"
            title="Quality control starts with clear review points."
            description="The quality-control foundation covers sample review, supplier comparison, packaging checks, label verification, and export documentation support."
          />
          <div className="mt-10">
            <TrustPillarsGrid pillars={qualityControlPillars} showCTA />
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Process"
            title="A practical review workflow for China-to-Saudi sourcing."
            description="INCAR helps connect buyer requirements, supplier comparison, sample and packaging checks, and export coordination documents."
          />
          <div className="mt-10">
            <TrustProcess steps={trustProcessSteps} />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Proof points"
            title="What INCAR helps review and coordinate."
            description="These points describe service support only. They do not claim certifications, legal outcomes, or completed client projects."
          />
          <div className="mt-10">
            <TrustProofPoints pillars={qualityControlPillars} />
          </div>
        </div>
      </section>

      <TrustFinalCTA
        title="Send an RFQ with the details needed for sourcing review."
        description="Include part numbers, quantities, packaging preferences, and target market details so INCAR can review the request with the right context."
        primaryLabel="Request Quotation"
        primaryHref="/rfq"
        secondaryLabel="Learn About INCAR"
        secondaryHref="/about"
      />
    </>
  );
}
