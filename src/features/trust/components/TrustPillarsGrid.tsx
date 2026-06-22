import type { TrustPillar } from "@/types/trust";
import { TrustPillarCard } from "./TrustPillarCard";

type TrustPillarsGridProps = {
  pillars: TrustPillar[];
  showCTA?: boolean;
};

export function TrustPillarsGrid({ pillars, showCTA = false }: TrustPillarsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {pillars.map((pillar) => (
        <TrustPillarCard key={pillar.id} pillar={pillar} showCTA={showCTA} />
      ))}
    </div>
  );
}
