import { ProcessSteps } from "./ProcessSteps";
import { SectionHeader } from "./SectionHeader";

type ProcessSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  steps: {
    step: string;
    title: string;
    description: string;
  }[];
};

export function ProcessSection({
  eyebrow,
  title,
  description,
  steps,
}: ProcessSectionProps) {
  return (
    <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          inverse
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <ProcessSteps steps={steps} />
      </div>
    </section>
  );
}
