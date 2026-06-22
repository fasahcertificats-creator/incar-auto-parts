import { CTAButton } from "@/components/CTAButton";
import type { TrustPillar } from "@/types/trust";

type TrustPillarCardProps = {
  pillar: TrustPillar;
  showCTA?: boolean;
};

export function TrustPillarCard({ pillar, showCTA = false }: TrustPillarCardProps) {
  return (
    <article className="incar-card rounded-lg p-5">
      <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">
        {pillar.shortDescription}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {pillar.highlights.slice(0, 3).map((highlight) => (
          <span
            key={highlight}
            className="rounded-sm border border-border bg-background px-2.5 py-1 text-xs font-semibold text-metallic-silver"
          >
            {highlight}
          </span>
        ))}
      </div>
      {showCTA ? (
        <div className="mt-5">
          <CTAButton href={pillar.relatedCTA.href} variant={pillar.relatedCTA.variant}>
            {pillar.relatedCTA.label}
          </CTAButton>
        </div>
      ) : null}
    </article>
  );
}
