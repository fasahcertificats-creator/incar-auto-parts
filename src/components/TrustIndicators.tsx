import { TrustCard } from "./TrustCard";

const indicators = [
  ["China supply network", "Factory sourcing and category-level matching"],
  ["Saudi RFQ desk", "Wholesale import support for Saudi buyers"],
  ["Inspection-first", "Sample, packaging, and pre-shipment checks"],
  ["Private label ready", "Packaging boxes, labels, barcode, and OEM/ODM support"],
];

export function TrustIndicators() {
  return (
    <section className="bg-background px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
        {indicators.map(([title, description]) => (
          <TrustCard key={title} title={title} description={description} />
        ))}
      </div>
    </section>
  );
}
