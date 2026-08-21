"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "../lib/admin-navigation";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="grid gap-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href);
        const comingSoon = item.status === "coming-soon";

        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`incar-focus relative flex min-h-11 items-center justify-between gap-2 rounded-md border-l-2 px-3 text-sm font-semibold transition ${
              active
                ? "border-primary bg-white/[0.04] text-white"
                : `border-transparent hover:bg-white/[0.03] ${
                    comingSoon
                      ? "text-muted/70 hover:text-metallic-silver"
                      : "text-metallic-silver hover:text-white"
                  }`
            }`}
          >
            <span>{item.label}</span>
            {comingSoon ? (
              <span className="rounded-full border border-metallic-silver/20 bg-surface-elevated px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                Coming soon
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
