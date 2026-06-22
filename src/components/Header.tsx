"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavigation } from "@/config/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useRfq } from "@/contexts/RfqContext";
import { brand } from "@/lib/brand";
import { MobileMenu } from "./layout/MobileMenu";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { locale, toggleLocale } = useLocale();
  const { itemCount } = useRfq();
  const quoteLabel =
    itemCount > 0 ? `Request Quotation (${itemCount})` : "Request Quotation";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="incar-focus flex min-w-0 items-center gap-3 rounded-md">
          <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md border border-metallic-silver/35 bg-surface-elevated text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            {brand.shortName}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-bold uppercase tracking-[0.16em]">
              {brand.name}
            </span>
            <span className="hidden max-w-[18rem] truncate text-xs text-metallic-silver/72 sm:block">
              {brand.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-3 text-xs font-medium text-metallic-silver/72 lg:flex xl:gap-5 xl:text-sm">
          {mainNavigation.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`incar-focus whitespace-nowrap rounded-sm border-b py-1 transition hover:text-white ${
                  active ? "border-primary text-white" : "border-transparent"
                }`}
              >
                {locale === "ar" ? item.arLabel : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleLocale}
            className="incar-focus min-h-10 rounded-md border border-border px-3 text-sm font-semibold text-metallic-silver transition hover:bg-white/[0.04] hover:text-white"
          >
            {locale === "en" ? "العربية" : "EN"}
          </button>
          <Link
            href="/rfq"
            className="incar-focus inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover"
          >
            {quoteLabel}
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
