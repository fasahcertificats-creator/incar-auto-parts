import type { PrivateLabelService } from "@/types/private-label";
import { CTAButton } from "./CTAButton";
import { SectionHeader } from "./SectionHeader";

type PrivateLabelSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  services: PrivateLabelService[];
};

export function PrivateLabelSection({
  eyebrow,
  title,
  description,
  cta,
  services,
}: PrivateLabelSectionProps) {
  return (
    <section className="bg-surface px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader
            inverse
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <div className="mt-7">
            <CTAButton href="/private-label">{cta}</CTAButton>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.slice(0, 4).map((service) => (
            <article key={service.id} className="incar-card-elevated rounded-lg p-5">
              <h3 className="font-semibold text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
