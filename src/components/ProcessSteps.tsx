type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

type ProcessStepsProps = {
  steps: ProcessStep[];
};

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
      {steps.map((item) => (
        <div key={item.step} className="bg-surface p-6">
          <p className="text-sm font-bold text-primary">{item.step}</p>
          <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
