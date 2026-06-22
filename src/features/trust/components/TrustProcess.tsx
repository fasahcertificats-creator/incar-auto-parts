import type { TrustProcessStep } from "@/types/trust";

type TrustProcessProps = {
  steps: TrustProcessStep[];
};

export function TrustProcess({ steps }: TrustProcessProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[...steps]
        .sort((first, second) => first.order - second.order)
        .map((step) => (
          <article key={step.id} className="incar-card-elevated rounded-lg p-5">
            <span className="text-sm font-bold text-primary">
              {String(step.order).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-white">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              {step.description}
            </p>
          </article>
        ))}
    </div>
  );
}
