"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavigation } from "@/config/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useRfq } from "@/contexts/RfqContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref, stripLocaleFromPathname } from "@/i18n/routing";
import { brand } from "@/lib/brand";
import { HeaderSearch } from "./HeaderSearch";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./layout/MobileMenu";

function isActivePath(pathname: string, href: string) {
  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  return pathWithoutLocale === href || pathWithoutLocale.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const { itemCount } = useRfq();
  const dictionary = getDictionary(locale);
  const quoteLabel =
    itemCount > 0
      ? dictionary.common.requestQuotationCount.replace("{count}", String(itemCount))
      : dictionary.common.requestQuotation;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-[94rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <MobileMenu />

        <Link
          href={localizeHref(locale, "/")}
          className="incar-focus flex min-w-0 items-center gap-2 rounded-md"
        >
          <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-md border border-metallic-silver/35 bg-surface-elevated text-sm font-black text-white">
            {brand.shortName}
          </span>
          <span className="hidden min-w-0 text-xs font-bold uppercase tracking-[0.14em] xl:block">
            {dictionary.brand.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-2 text-xs font-medium text-metallic-silver lg:flex 2xl:gap-4 2xl:text-sm">
          {mainNavigation.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.key}
                href={localizeHref(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className={`incar-focus min-h-11 whitespace-nowrap rounded-sm border-b px-1 py-3 transition hover:text-white ${
                  active ? "border-primary text-white" : "border-transparent"
                }`}
              >
                {dictionary.navigation[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <HeaderSearch />
          <Link
            href={localizeHref(locale, "/rfq/upload-list")}
            className="incar-focus inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md border border-border bg-surface-elevated px-3 text-xs font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
          >
            {dictionary.navigation.uploadPartsList}
          </Link>
          <Link
            href={localizeHref(locale, "/rfq")}
            className="incar-focus inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-hover"
          >
            {quoteLabel}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <HeaderSearch compact />
          <Link
            href={localizeHref(locale, "/rfq")}
            aria-label={quoteLabel}
            className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-white"
          >
            {itemCount > 0 ? `RFQ (${itemCount})` : "RFQ"}
          </Link>
        </div>
      </div>
    </header>
  );
}
