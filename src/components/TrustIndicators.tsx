import { TrustCard } from "./TrustCard";

const indicators = [
  ["Manufacturing knowledge", "Production capability and category review"],
  ["Middle East RFQ focus", "Wholesale import request support"],
  ["Inspection-first", "Sample, packaging, and pre-shipment checks"],
  ["Private label ready", "Packaging, labels, barcodes, and product-development support"],
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
