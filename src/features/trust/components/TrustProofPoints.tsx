import type { TrustPillar } from "@/types/trust";

type TrustProofPointsProps = {
  pillars: TrustPillar[];
};

export function TrustProofPoints({ pillars }: TrustProofPointsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pillars.map((pillar) => (
        <article key={pillar.id} className="incar-card rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted">
            {pillar.proofPoints.map((proofPoint) => (
              <li key={proofPoint} className="border-l-2 border-primary/70 pl-3">
                {proofPoint}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
