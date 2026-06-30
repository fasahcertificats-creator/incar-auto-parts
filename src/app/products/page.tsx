import { CTAButton } from "@/components/CTAButton";
import { PageHero } from "@/components/PageHero";
import { ProductExplorer } from "@/components/ProductExplorer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "RFQ Product Catalog",
  "Search Toyota and Hyundai wholesale auto parts by part number, OEM number, model, and category for Saudi RFQ sourcing.",
);

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="RFQ-ready Toyota and Hyundai parts"
        description="Search by part number, OEM number, car model, brand, and category. Add products to your RFQ list or upload your own Excel file."
      />
      <section className="bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 rounded-lg border border-border bg-background p-5 md:flex-row md:items-center">
          <p className="text-sm leading-6 text-metallic-silver">
            Can&apos;t find the part you need? Send the part number, OEM number,
            vehicle model, or product photo through a sourcing request.
          </p>
          <CTAButton href="/contact" variant="secondary" className="shrink-0">
            Send Sourcing Request
          </CTAButton>
        </div>
      </section>
      <ProductExplorer />
    </>
  );
}
