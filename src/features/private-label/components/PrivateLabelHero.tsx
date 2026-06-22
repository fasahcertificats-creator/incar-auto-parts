import { CTAButton } from "@/components/CTAButton";
import type { PrivateLabelTrustPoint } from "@/types/private-label";

type PrivateLabelHeroProps = {
  trustPoints: PrivateLabelTrustPoint[];
};

export function PrivateLabelHero({ trustPoints }: PrivateLabelHeroProps) {
  return (
    <section className="bg-background px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-metallic-silver">
            Private Label
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight md:text-6xl">
            Build Your Own Auto Parts Brand Through China Sourcing
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-metallic-silver/76">
            INCAR helps Saudi wholesale buyers develop private label auto parts
            with product sourcing, custom packaging, logo printing, barcode
            labeling, quality inspection, and export support from China.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="#private-label-inquiry">
              Start Private Label Inquiry
            </CTAButton>
            <CTAButton href="/rfq" variant="secondary">
              Request Quotation
            </CTAButton>
          </div>
        </div>

        <div className="incar-card-elevated rounded-lg p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Strategic sourcing program
          </p>
          <div className="mt-6 grid gap-3">
            {trustPoints.map((point) => (
              <div
                key={point.id}
                className="rounded-md border border-border bg-background px-4 py-3 text-sm font-semibold text-metallic-silver"
              >
                {point.label}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-muted">
            Built for wholesale buyers who need supplier coordination,
            controlled packaging, clear quality checkpoints, and China-to-Saudi
            export support.
          </p>
        </div>
      </div>
    </section>
  );
}
