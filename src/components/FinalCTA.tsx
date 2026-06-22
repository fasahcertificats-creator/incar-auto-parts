import { CTAButton } from "./CTAButton";

type FinalCTAProps = {
  eyebrow: string;
  title: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function FinalCTA({
  eyebrow,
  title,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: FinalCTAProps) {
  return (
    <section className="bg-background px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold">{title}</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton href={primaryHref}>{primaryLabel}</CTAButton>
          {secondaryHref && secondaryLabel ? (
            <CTAButton href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </CTAButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}
