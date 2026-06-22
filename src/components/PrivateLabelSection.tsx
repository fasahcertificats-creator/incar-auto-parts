import { privateLabelServices } from "@/data/private-label";
import { CTAButton } from "./CTAButton";
import { SectionHeader } from "./SectionHeader";

export function PrivateLabelSection() {
  return (
    <section className="bg-surface px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader
            inverse
            eyebrow="Private label"
            title="Build a Saudi-ready auto parts brand through China sourcing."
            description="A preview of INCAR private label support for Saudi wholesale buyers, including sourcing, packaging planning, logo printing, quality inspection, and export coordination."
          />
          <div className="mt-7">
            <CTAButton href="/private-label">
              Explore Private Label Solutions
            </CTAButton>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {privateLabelServices.slice(0, 4).map((service) => (
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
