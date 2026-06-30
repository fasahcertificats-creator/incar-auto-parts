import Link from "next/link";
import { CatalogCard } from "@/components/CatalogCard";
import { CTAButton } from "@/components/CTAButton";
import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { PrivateLabelSection } from "@/components/PrivateLabelSection";
import { ProcessSection } from "@/components/ProcessSection";
import { SectionHeader } from "@/components/SectionHeader";
import { catalogs } from "@/data/catalogs";
import { trustPillars } from "@/data/trust";
import { TrustSection } from "@/features/trust/components";

const sourcingReasons = [
  "China factory network with category-level supplier matching",
  "Inspection reports, sample validation, and export carton control",
  "OEM number matching for Saudi wholesale and garage supply channels",
  "RFQ-based workflow built for bulk sourcing orders",
];

const servicePillars = [
  {
    title: "Auto Parts Sourcing",
    description:
      "We help compare China supplier options for Toyota, Hyundai, and future wholesale category expansion.",
    ctaLabel: "Send Sourcing Request",
    href: "/contact",
  },
  {
    title: "RFQ-Based Wholesale Supply",
    description:
      "Buyers send part numbers, OEM numbers, Excel lists, or selected products for quotation review.",
    ctaLabel: "Request Quotation",
    href: "/rfq",
  },
  {
    title: "Private Label Solutions",
    description:
      "Support for factory matching, custom packaging, logo printing, labels, barcode details, and samples.",
    ctaLabel: "Start Private Label Inquiry",
    href: "/private-label#private-label-inquiry",
  },
  {
    title: "Quality Inspection Support",
    description:
      "Practical sample, product consistency, label, packaging, and pre-shipment review checkpoints.",
    ctaLabel: "Review Quality Support",
    href: "/quality-control",
  },
  {
    title: "Packaging Control",
    description:
      "Export carton review, Private Label packaging coordination, and Arabic/English readiness support.",
    ctaLabel: "Plan Packaging",
    href: "/private-label",
  },
  {
    title: "Export Coordination to Saudi Arabia",
    description:
      "Assistance with product information, packing details, invoice and packing list support, and supplier communication.",
    ctaLabel: "Speak With INCAR",
    href: "/contact",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <TrustSection
        eyebrow="Trust system"
        title="Six ways INCAR reduces sourcing uncertainty."
        description="Saudi wholesale buyers need clear sourcing support before submitting RFQs. INCAR explains quality checks, supplier review, packaging control, export support, Saudi market focus, and China-based coordination in one structured system."
        pillars={trustPillars}
        primaryCTA={{ label: "Request Quotation", href: "/rfq" }}
        secondaryCTA={{ label: "Learn About INCAR", href: "/about" }}
      />

      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Why source with INCAR"
            title="A premium sourcing desk for Saudi wholesale buyers."
            description="INCAR focuses on factory screening, practical MOQ planning, private-label readiness, and export details that matter once the order leaves China."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {sourcingReasons.map((reason, index) => (
              <div key={reason} className="incar-card-elevated rounded-lg p-6">
                <span className="text-sm font-bold text-primary">
                  0{index + 1}
                </span>
                <p className="mt-4 text-lg font-semibold leading-7 text-white">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Service pillars"
            title="Business services built around wholesale conversion."
            description="INCAR supports Saudi buyers through RFQ-first sourcing, Private Label planning, inspection support, packaging control, and export coordination from China."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {servicePillars.map((service) => (
              <article
                key={service.title}
                className="incar-card flex h-full flex-col rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold text-white">
                  {service.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="incar-focus mt-5 inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
                >
                  {service.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PrivateLabelSection />

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionHeader
              eyebrow="Quality control preview"
              title="Trust grows when sourcing checkpoints are clear."
              description="INCAR helps review supplier fit, samples, packaging, labels, and export details so Saudi wholesale buyers can send RFQs with clearer expectations."
            />
            <CTAButton href="/quality-control" variant="ghost" className="mt-7">
              Review Quality Control
            </CTAButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustPillars.slice(0, 4).map((pillar) => (
              <div key={pillar.id} className="incar-card rounded-lg p-5">
                <p className="text-lg font-semibold text-white">
                  {pillar.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {pillar.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />

      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            eyebrow="Catalogs"
            title="Catalog requests qualify the next sourcing conversation."
            description="Request catalog material with brand, model, MOQ, compatibility, and Private Label context before INCAR follows up through WhatsApp or email."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {catalogs.slice(0, 4).map((catalog) => (
              <CatalogCard key={catalog.id} catalog={catalog} />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        eyebrow="China to Saudi RFQ desk"
        title="Send your RFQ list and get factory sourcing options."
        primaryHref="/rfq"
        primaryLabel="Request Quotation"
        secondaryHref="/contact"
        secondaryLabel="Contact Us"
      />
    </>
  );
}
