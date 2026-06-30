import type { Catalog } from "@/types";
import { CTAButton } from "./CTAButton";

export function CatalogCard({
  catalog,
  ctaLabel,
}: {
  catalog: Catalog;
  ctaLabel: string;
}) {
  return (
    <article className="incar-card rounded-lg p-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-metallic-silver">
          {catalog.brand} / {catalog.fileType}
        </p>
        <span className="rounded-sm bg-surface-elevated px-3 py-1 text-xs font-semibold text-metallic-silver">
          {catalog.updated}
        </span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-white">{catalog.title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{catalog.description}</p>
      <p className="mt-5 text-sm text-metallic-silver">{catalog.audience}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white">{catalog.items}</p>
        <CTAButton
          href="/catalogs#catalog-request"
          variant="primary"
          className="min-h-11 px-4 py-2"
        >
          {ctaLabel}
        </CTAButton>
      </div>
    </article>
  );
}
