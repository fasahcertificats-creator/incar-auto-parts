import Link from "next/link";
import { CatalogCard } from "@/components/CatalogCard";
import { CTAButton } from "@/components/CTAButton";
import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { PrivateLabelSection } from "@/components/PrivateLabelSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { catalogs } from "@/data/catalogs";
import { trustPillars } from "@/data/trust";
import { TrustSection } from "@/features/trust/components";
import { getActiveCategories, getFeaturedProducts } from "@/lib/products";

const sourcingReasons = [
  "China factory network with category-level supplier matching",
  "Inspection reports, sample validation, and export carton control",
  "OEM number matching for Saudi wholesale and garage supply channels",
  "RFQ-based workflow built for bulk sourcing orders",
];

export default function Home() {
  const categories = getActiveCategories();
  const featuredProducts = getFeaturedProducts(6);

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
            eyebrow="Launch categories"
            title="Wholesale product categories for RFQ sourcing."
            description="Start with fast-moving Toyota and Hyundai programs, then send your part-number list for factory matching across more brands."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Link
                href="/products"
                key={category.id}
                className="incar-focus incar-card rounded-lg p-5 transition hover:border-metallic-silver/35"
              >
                <p className="text-lg font-semibold text-white">
                  {category.displayName}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PrivateLabelSection />
      <ProcessSection />

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Featured products"
              title="Fast-moving RFQ products."
              description="A short preview of launch SKUs for quotation-led sourcing conversations."
            />
            <CTAButton href="/products" variant="ghost">
              View all products
            </CTAButton>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            eyebrow="Catalogs"
            title="Shareable catalogs for purchasing teams."
            description="Use catalog requests as qualified lead paths for part numbers, MOQ, compatibility, and packaging requirements."
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
