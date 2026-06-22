import { CTAButton } from "@/components/CTAButton";
import { SectionHeader } from "@/components/SectionHeader";
import type { TrustPillar } from "@/types/trust";
import { TrustPillarsGrid } from "./TrustPillarsGrid";

type TrustSectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  pillars: TrustPillar[];
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  background?: "background" | "surface";
};

export function TrustSection({
  eyebrow = "Trust system",
  title,
  description,
  pillars,
  primaryCTA,
  secondaryCTA,
  background = "background",
}: TrustSectionProps) {
  return (
    <section
      className={`px-4 py-16 sm:px-6 lg:px-8 ${
        background === "surface" ? "bg-surface" : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          {primaryCTA || secondaryCTA ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {primaryCTA ? (
                <CTAButton href={primaryCTA.href}>{primaryCTA.label}</CTAButton>
              ) : null}
              {secondaryCTA ? (
                <CTAButton href={secondaryCTA.href} variant="secondary">
                  {secondaryCTA.label}
                </CTAButton>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="mt-10">
          <TrustPillarsGrid pillars={pillars} />
        </div>
      </div>
    </section>
  );
}
