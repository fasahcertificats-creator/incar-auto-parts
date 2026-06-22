import { CTAButton } from "@/components/CTAButton";

type TrustFinalCTAProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function TrustFinalCTA({
  eyebrow = "Trust and sourcing",
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: TrustFinalCTAProps) {
  return (
    <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton href={primaryHref}>{primaryLabel}</CTAButton>
          {secondaryLabel && secondaryHref ? (
            <CTAButton href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </CTAButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}
