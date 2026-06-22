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
      <ProductExplorer />
    </>
  );
}
