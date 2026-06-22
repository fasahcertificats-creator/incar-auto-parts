import { SectionHeader } from "@/components/SectionHeader";
import {
  privateLabelCategories,
  privateLabelProcessSteps,
  privateLabelServices,
  privateLabelTrustPoints,
} from "@/data/private-label";
import { getTrustPillarsBySlug } from "@/data/trust";
import {
  PrivateLabelCategoryCard,
  PrivateLabelFinalCTA,
  PrivateLabelHero,
  PrivateLabelInquiryForm,
  PrivateLabelProcessSteps,
  PrivateLabelQualitySection,
  PrivateLabelServiceCard,
} from "@/features/private-label/components";
import { TrustProofPoints } from "@/features/trust/components";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Private Label Auto Parts",
  "Private Label auto parts sourcing, custom packaging, logo printing, barcode labels, quality inspection, and China export support for Saudi wholesale buyers.",
);

const privateLabelReasons = [
  "Higher margin potential through owned brand positioning and controlled packaging.",
  "Stronger customer loyalty when buyers recognize a consistent wholesale product line.",
  "Better brand control across product labels, box information, and market presentation.",
  "Less direct price comparison than generic unbranded sourcing programs.",
  "Market differentiation through focused categories, packaging standards, and service support.",
  "Long-term business value from repeatable sourcing, quality checks, and export coordination.",
];

const packagingDetails = [
  "Box design",
  "Logo placement",
  "Product label",
  "Barcode",
  "Carton marking",
  "Arabic/English packaging readiness",
  "Market-specific packaging information",
];

const privateLabelTrustPillars = getTrustPillarsBySlug([
  "packaging-control",
  "quality-inspection-system",
  "factory-verification",
  "export-documentation",
  "saudi-market-focus",
]);

export default function PrivateLabelPage() {
  return (
    <>
      <PrivateLabelHero trustPoints={privateLabelTrustPoints} />

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader
            eyebrow="Why private label matters"
            title="A stronger wholesale position starts with controlled brand development."
            description="Private Label can help Saudi wholesale buyers build a clearer market position when product selection, packaging, quality checks, and export details are managed with discipline."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {privateLabelReasons.map((reason, index) => (
              <article key={reason} className="incar-card-elevated rounded-lg p-5">
                <span className="text-sm font-bold text-primary">
                  0{index + 1}
                </span>
                <p className="mt-4 text-sm leading-6 text-metallic-silver">
                  {reason}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Service scope"
            title="Private Label services for China-to-Saudi sourcing."
            description="INCAR supports the commercial, packaging, inspection, and export details needed to prepare a professional wholesale private label program."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {privateLabelServices.map((service) => (
              <PrivateLabelServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Private label process"
            title="A professional sourcing workflow from category selection to export."
            description="Each step is designed for wholesale buyers who need organized requirements, supplier coordination, sample review, quality checkpoints, and shipping support."
          />
          <div className="mt-10">
            <PrivateLabelProcessSteps steps={privateLabelProcessSteps} />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Suitable categories"
            title="Initial product categories for private label programs."
            description="The private label scope follows the current INCAR launch categories so sourcing, RFQ, and product data stay aligned."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {privateLabelCategories.map((category) => (
              <PrivateLabelCategoryCard
                key={category.category}
                category={category}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <SectionHeader
            eyebrow="Packaging and brand development"
            title="Turn sourcing requirements into market-ready packaging plans."
            description="INCAR helps buyers organize private label packaging requirements without claiming unverified client work or completed brand programs."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {packagingDetails.map((detail) => (
              <div key={detail} className="incar-card rounded-lg p-5">
                <p className="font-semibold text-white">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Trust support for Private Label"
            title="Private Label programs need controlled supplier, packaging, and export details."
            description="INCAR connects packaging control, label verification, quality inspection, factory matching, and export support into one review path for Saudi wholesale brand development."
          />
          <div className="mt-10">
            <TrustProofPoints pillars={privateLabelTrustPillars} />
          </div>
        </div>
      </section>

      <PrivateLabelQualitySection />

      <section
        id="private-label-inquiry"
        className="bg-surface px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Start inquiry"
            title="Tell us about your private label program."
            description="Share your contact details, brand direction, product category, target market, estimated quantity, and packaging requirements. This frontend-only inquiry will later connect to the private label request pipeline."
          />
          <PrivateLabelInquiryForm />
        </div>
      </section>

      <PrivateLabelFinalCTA />
    </>
  );
}
