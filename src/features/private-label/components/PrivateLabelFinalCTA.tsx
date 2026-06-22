import { CTAButton } from "@/components/CTAButton";

export function PrivateLabelFinalCTA() {
  return (
    <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Private label inquiry
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">
            Start a structured brand development conversation.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Share your product category, packaging direction, and target market
            so INCAR can review sourcing and private label requirements.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton href="#private-label-inquiry">
            Start Private Label Inquiry
          </CTAButton>
          <CTAButton href="/rfq" variant="secondary">
            Request Quotation
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
