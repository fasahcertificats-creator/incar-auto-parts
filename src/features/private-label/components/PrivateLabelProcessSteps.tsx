import type { PrivateLabelProcessStep } from "@/types/private-label";

type PrivateLabelProcessStepsProps = {
  steps: PrivateLabelProcessStep[];
};

export function PrivateLabelProcessSteps({ steps }: PrivateLabelProcessStepsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {steps.map((step) => (
        <article key={step.step} className="incar-card-elevated rounded-lg p-5">
          <span className="text-sm font-bold text-primary">{step.step}</span>
          <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
        </article>
      ))}
    </div>
  );
}
