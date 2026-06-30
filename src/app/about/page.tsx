import { FinalCTA } from "@/components/FinalCTA";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { trustPillars, trustProcessSteps } from "@/data/trust";
import { TrustPillarsGrid, TrustProcess } from "@/features/trust/components";
import { brand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About Us",
  "About INCAR AUTO PARTS, a China-based sourcing partner for Saudi wholesale auto parts buyers.",
);

const aboutTrustNarrative = [
  {
    title: "China sourcing advantage",
    copy: "INCAR helps Saudi buyers compare Chinese supplier options, coordinate samples, and review practical MOQ and packaging requirements.",
  },
  {
    title: "Factory verification",
    copy: "Supplier review focuses on category fit, production capability, communication readiness, lead time, and export support.",
  },
  {
    title: "Quality inspection approach",
    copy: "The inspection approach supports sample review, product consistency checks, packaging inspection, label verification, and pre-shipment checking.",
  },
  {
    title: "Export support",
    copy: "INCAR assists with product information, packing details, invoice and packing list support, and shipment document coordination.",
  },
  {
    title: "Saudi market focus",
    copy: "The platform is built around Saudi wholesale RFQ behavior, WhatsApp-friendly communication, and focused Toyota and Hyundai launch programs.",
  },
  {
    title: "Private Label capability",
    copy: "Private Label support covers packaging coordination, logo placement, barcode and label checks, factory matching, and export preparation.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A China-based sourcing desk for Saudi auto parts wholesalers."
        description={`${brand.description} We connect Saudi wholesale buyers with suitable Chinese factories, inspection workflows, private label packaging, and export support.`}
        align="left"
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="How INCAR builds trust"
            title="A sourcing partner should make the review process clear."
            description="INCAR uses practical trust pillars to help Saudi wholesale buyers understand what is reviewed, coordinated, and prepared before an RFQ or Private Label inquiry moves forward."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {aboutTrustNarrative.map(({ title, copy }) => (
              <div key={title} className="incar-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{copy}</p>
              </div>
            ))}
            <div className="incar-card rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white">Our Journey</h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                INCAR is being built to connect Saudi wholesale auto parts
                buyers with China-based sourcing, inspection, packaging, and
                private label support. This section will later include the real
                founder journey and project story.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Trust pillars"
            title="Structured support for serious wholesale sourcing."
            description="The same trust system supports RFQ review, supplier comparison, Private Label planning, and export coordination."
          />
          <div className="mt-10">
            <TrustPillarsGrid pillars={trustPillars} />
          </div>
        </div>
      </section>
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Review workflow"
            title="A calm sourcing process from requirements to export coordination."
            description="The trust workflow keeps buyer requirements, supplier comparison, sample and packaging checks, and export details connected."
          />
          <div className="mt-10">
            <TrustProcess steps={trustProcessSteps} />
          </div>
        </div>
      </section>
      <FinalCTA
        eyebrow="Speak with INCAR"
        title="Discuss your wholesale sourcing program with the INCAR team."
        primaryHref="/contact"
        primaryLabel="Speak With INCAR"
        secondaryHref="/rfq"
        secondaryLabel="Request Quotation"
      />
    </>
  );
}
