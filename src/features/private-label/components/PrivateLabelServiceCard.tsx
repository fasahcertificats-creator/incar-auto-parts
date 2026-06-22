import type { PrivateLabelService } from "@/types/private-label";

type PrivateLabelServiceCardProps = {
  service: PrivateLabelService;
};

export function PrivateLabelServiceCard({ service }: PrivateLabelServiceCardProps) {
  return (
    <article className="incar-card rounded-lg p-5">
      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{service.description}</p>
    </article>
  );
}
