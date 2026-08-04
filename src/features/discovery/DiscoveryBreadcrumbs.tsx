import Link from "next/link";
import type { Locale } from "@/i18n/types";
import { localizeHref } from "@/i18n/routing";

export type DiscoveryBreadcrumbItem = {
  label: string;
  href?: string;
};

export function DiscoveryBreadcrumbs({
  locale,
  items,
}: {
  locale: Locale;
  items: DiscoveryBreadcrumbItem[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" dir="ltr">/</span> : null}
            {item.href ? (
              <Link
                href={localizeHref(locale, item.href)}
                className="incar-focus rounded-sm font-semibold text-metallic-silver hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-white">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
