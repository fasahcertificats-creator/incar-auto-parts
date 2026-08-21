import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import type { Locale } from "@/i18n/types";

export function DiscoveryActions({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).discovery.actions;

  return (
    <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        <article className="incar-card rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white">{copy.uploadTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{copy.uploadDescription}</p>
          <Link
            href={localizeHref(locale, "/rfq#upload-parts-list")}
            className="incar-focus mt-5 inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
          >
            {copy.uploadAction}
          </Link>
        </article>
        <article className="incar-card rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white">{copy.sourcingTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{copy.sourcingDescription}</p>
          <Link
            href={localizeHref(locale, "/sourcing-services")}
            className="incar-focus mt-5 inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
          >
            {copy.sourcingAction}
          </Link>
        </article>
      </div>
    </section>
  );
}
