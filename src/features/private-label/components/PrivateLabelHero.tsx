import { CTAButton } from "@/components/CTAButton";
import type { Dictionary } from "@/i18n/dictionaries";
import type { PrivateLabelTrustPoint } from "@/types/private-label";

type PrivateLabelHeroProps = {
  trustPoints: PrivateLabelTrustPoint[];
  dictionary: Dictionary;
};

export function PrivateLabelHero({ trustPoints, dictionary }: PrivateLabelHeroProps) {
  return (
    <section className="bg-background px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-metallic-silver">
            {dictionary.pages.privateLabel.heroEyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl text-3xl font-semibold leading-tight md:text-5xl">
            {dictionary.pages.privateLabel.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-metallic-silver/76">
            {dictionary.pages.privateLabel.heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="#private-label-inquiry">
              {dictionary.common.startPrivateLabelInquiry}
            </CTAButton>
            <CTAButton href="/rfq" variant="secondary">
              {dictionary.common.requestQuotation}
            </CTAButton>
          </div>
        </div>

        <div className="incar-card-elevated rounded-lg p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            {dictionary.pages.privateLabel.heroPanelEyebrow}
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
            {dictionary.pages.privateLabel.heroPanelCopy}
          </p>
        </div>
      </div>
    </section>
  );
}
