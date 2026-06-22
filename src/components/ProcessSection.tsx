import { ProcessSteps } from "./ProcessSteps";
import { SectionHeader } from "./SectionHeader";

const steps = [
  {
    step: "01",
    title: "Send RFQ",
    description: "Share OEM numbers, quantities, target grade, model list, or Excel file.",
  },
  {
    step: "02",
    title: "Factory sourcing",
    description: "We compare factory options by MOQ, quality grade, pricing, and lead time.",
  },
  {
    step: "03",
    title: "Confirm quality",
    description: "Samples, labels, packaging, and inspection checkpoints are aligned before shipment.",
  },
  {
    step: "04",
    title: "Export support",
    description: "Documentation, cartons, and shipping coordination are prepared for Saudi buyers.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          inverse
          eyebrow="RFQ process"
          title="From part-number list to export-ready supply."
          description="A sourcing workflow for serious wholesale buyers, built around quotation requests and factory matching."
        />
        <ProcessSteps steps={steps} />
      </div>
    </section>
  );
}
