"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavigation } from "@/config/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useRfq } from "@/contexts/RfqContext";
import { useCart } from "@/features/cart/cart-context";
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
  const { itemCount: cartItemCount } = useCart();
  const dictionary = getDictionary(locale);
  const quoteLabel =
    itemCount > 0
      ? dictionary.common.requestQuotationCount.replace("{count}", String(itemCount))
      : dictionary.common.requestQuotation;
  const cartLabel = dictionary.cart.navLabel;

  return (
    <header className="sticky top-0 z-50 text-white shadow-[0_10px_30px_rgba(19,27,38,0.25)]">
      {/* Top utility strip — Marketo-style thin bar above the navy header */}
      <div className="hidden bg-navy-deep text-[12px] text-white/70 lg:block">
        <div className="mx-auto flex max-w-[94rem] items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <p className="font-medium">
            {dictionary.brand.tagline} · {brand.office}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${brand.email}`}
              className="incar-focus rounded-sm font-semibold text-white/85 transition hover:text-white"
              dir="ltr"
            >
              {brand.email}
            </a>
            <LanguageSwitcher dark />
          </div>
        </div>
      </div>

      {/* Mobile bar */}
      <div className="bg-navy lg:hidden">
        <div className="mx-auto grid max-w-[94rem] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:px-6">
          <div className="justify-self-start">
            <MobileMenu />
          </div>

          <Link
            href={localizeHref(locale, "/")}
            aria-label={dictionary.brand.name}
            className="incar-focus rounded-md px-2 py-2 text-sm font-black tracking-[0.14em] text-white"
          >
            {brand.shortName}
          </Link>

          <Link
            href={localizeHref(locale, "/rfq")}
            aria-label={quoteLabel}
            className="incar-focus inline-flex min-h-11 items-center justify-center justify-self-end whitespace-nowrap rounded-md bg-primary px-3 text-xs font-semibold text-white transition hover:bg-primary-hover"
          >
            {dictionary.navigation.mobileRfq}
          </Link>
        </div>
        <div className="border-t border-white/10 px-4 pb-3 pt-2.5 sm:px-6">
          <HeaderSearch wide />
        </div>
      </div>

      {/* Desktop main navy row: logo + big centered search + actions */}
      <div className="hidden bg-navy lg:block">
        <div className="mx-auto flex max-w-[94rem] items-center gap-6 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link
            href={localizeHref(locale, "/")}
            className="incar-focus flex shrink-0 items-center gap-2.5 rounded-md"
          >
            <span className="flex h-11 w-16 items-center justify-center rounded-md bg-primary text-sm font-black tracking-wide text-white">
              {brand.shortName}
            </span>
            <span className="hidden text-xs font-bold uppercase tracking-[0.14em] text-white xl:block">
              {dictionary.brand.name}
            </span>
          </Link>

          <div className="min-w-0 flex-1">
            <HeaderSearch wide />
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <Link
              href={localizeHref(locale, "/cart")}
              aria-label={cartLabel}
              className="incar-focus relative inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md border border-white/20 px-3.5 text-xs font-semibold text-white/85 transition hover:border-white/45 hover:text-white"
            >
              {cartLabel}
              {cartItemCount > 0 ? (
                <span className="ms-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                  {cartItemCount}
                </span>
              ) : null}
            </Link>
            <Link
              href={localizeHref(locale, "/rfq")}
              className="incar-focus inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md bg-primary px-5 text-xs font-bold text-white transition hover:bg-primary-hover"
            >
              {quoteLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop nav row: white strip under the navy header, Marketo-style */}
      <div className="hidden border-b border-border bg-background lg:block">
        <div className="mx-auto flex max-w-[94rem] items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav
            aria-label={dictionary.navigation.menu}
            className="flex items-center gap-1 text-[13px] font-semibold text-ink"
          >
            {mainNavigation.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.key}
                  href={localizeHref(locale, item.href)}
                  aria-current={active ? "page" : undefined}
                  className={`incar-focus min-h-11 whitespace-nowrap rounded-sm border-b-2 px-3 py-3 transition hover:text-primary ${
                    active ? "border-primary text-primary" : "border-transparent"
                  }`}
                >
                  {dictionary.navigation[item.key]}
                </Link>
              );
            })}
          </nav>
          <Link
            href={localizeHref(locale, "/rfq/upload-list")}
            className="incar-focus inline-flex min-h-9 items-center whitespace-nowrap rounded-md border border-primary/35 px-3.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            {dictionary.navigation.uploadPartsList}
          </Link>
        </div>
      </div>
    </header>
  );
}
