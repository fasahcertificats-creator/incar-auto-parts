import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  futureTrustProofAssets,
  getTrustPillarsBySlug,
  trustProcessSteps,
} from "@/data/trust";
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
  "saudi-market-focus",
  "china-advantage",
]);

const qualityWorkflow = [
  "Sample review against buyer requirements, category expectations, and shared product details.",
  "Product consistency checks for repeatable supply conversations and RFQ clarification.",
  "Packaging inspection covering boxes, labels, barcode details, and carton information.",
  "Pre-shipment readiness support focused on practical review points before export coordination.",
];

const factoryApproach = [
  "Supplier screening based on category fit, MOQ, communication readiness, and export support.",
  "Production capability review without claiming blanket approval for every supplier option.",
  "Factory communication support so buyer requirements are understood before quotation review.",
  "Supplier option comparison for Saudi wholesale buyers evaluating China sourcing programs.",
];

const packagingControls = [
  "Export carton review and carton marking support.",
  "Private Label packaging coordination for logo, label, barcode, and box information.",
  "Arabic/English packaging readiness support for Saudi market expectations.",
  "Label verification before production or shipment coordination moves forward.",
];

const exportSupport = [
  "Commercial invoice and packing list support based on confirmed product and quantity details.",
  "Product information preparation for supplier communication and buyer review.",
  "Shipment coordination document support without legal or border-process promises.",
  "WhatsApp and email follow-up for Saudi wholesale purchasing teams.",
];

const serviceBoundaries = [
  "INCAR helps review sourcing details and supplier information; it does not present unsupported certifications.",
  "INCAR coordinates inspection and packaging checkpoints; it does not promise outcomes without real proof.",
  "INCAR assists export preparation; it does not make legal, customs, or delivery-result promises.",
];

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
        description="INCAR helps Saudi wholesale buyers review sourcing details before production and export coordination, using practical checkpoints, supplier communication, and clear service boundaries."
        align="left"
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Trust foundation"
            title="Six trust pillars for China-to-Saudi sourcing."
            description="The quality-control foundation covers inspection support, factory review, packaging control, export documentation, Saudi market focus, and the practical China sourcing advantage."
          />
          <div className="mt-10">
            <TrustPillarsGrid pillars={qualityControlPillars} />
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Quality inspection workflow"
            title="A practical review workflow from requirement review to export coordination."
            description="The trust process helps buyers understand how INCAR organizes requirements, supplier matching, sample or specification checks, packaging review, pre-shipment readiness, and RFQ follow-up."
          />
          <div className="mt-10">
            <TrustProcess steps={trustProcessSteps} />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.84fr_1.16fr]">
          <SectionHeader
            eyebrow="Inspection support"
            title="What INCAR helps review before sourcing moves forward."
            description="Quality-control support is built around practical checks that help buyers clarify product expectations, packaging needs, and supplier communication before quotation or shipment coordination."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {qualityWorkflow.map((item) => (
              <article key={item} className="incar-card rounded-lg p-5">
                <p className="text-sm leading-6 text-muted">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.84fr_1.16fr]">
          <SectionHeader
            eyebrow="Factory verification approach"
            title="Supplier review stays careful, comparative, and sourcing-led."
            description="INCAR helps compare supplier options and communication readiness without presenting supplier claims as automatic proof."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {factoryApproach.map((item) => (
              <article key={item} className="incar-card-elevated rounded-lg p-5">
                <p className="text-sm leading-6 text-metallic-silver">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.84fr_1.16fr]">
          <SectionHeader
            eyebrow="Packaging and labeling control"
            title="Packaging details matter before a wholesale order leaves China."
            description="The packaging-control layer supports private label planning, export carton review, barcode checks, and Saudi-ready product information."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {packagingControls.map((item) => (
              <article key={item} className="incar-card rounded-lg p-5">
                <p className="text-sm leading-6 text-muted">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.84fr_1.16fr]">
          <SectionHeader
            eyebrow="Export documentation support"
            title="Export coordination needs clean product, packing, and buyer communication details."
            description="INCAR assists with document preparation inputs and supplier communication while keeping commercial and border-process language careful."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {exportSupport.map((item) => (
              <article key={item} className="incar-card-elevated rounded-lg p-5">
                <p className="text-sm leading-6 text-metallic-silver">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.84fr_1.16fr]">
          <SectionHeader
            eyebrow="Saudi wholesale buyer focus"
            title="Trust content is organized around Saudi RFQ behavior."
            description="The quality-control page supports buyers who need part-number review, Toyota and Hyundai launch focus, Private Label readiness, WhatsApp-friendly follow-up, and China-to-Saudi export coordination."
          />
          <div className="incar-card rounded-lg p-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Service boundaries
            </p>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
              {serviceBoundaries.map((item) => (
                <li key={item} className="border-l-2 border-primary/70 pl-3">
                  {item}
                </li>
              ))}
            </ul>
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

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="incar-card-elevated rounded-lg p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Future proof assets
            </p>
            <p className="mt-4 max-w-4xl text-base leading-7 text-metallic-silver">
              {futureTrustProofAssets} These are placeholders for future real
              materials, not claims that those assets are already published.
            </p>
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
