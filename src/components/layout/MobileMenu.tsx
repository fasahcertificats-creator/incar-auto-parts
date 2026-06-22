"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { mainNavigation } from "@/config/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useRfq } from "@/contexts/RfqContext";
import { brand } from "@/lib/brand";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const { locale, toggleLocale } = useLocale();
  const { itemCount } = useRfq();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const quoteLabel = itemCount > 0 ? `Request Quotation (${itemCount})` : "Request Quotation";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver transition hover:bg-white/[0.04] hover:text-white"
      >
        Menu
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm">
          <div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="ms-auto flex h-full w-full max-w-sm flex-col border-l border-border bg-surface shadow-[0_28px_80px_rgba(0,0,0,0.52)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="incar-focus flex items-center gap-3 rounded-md"
              >
                <span className="flex h-10 w-16 items-center justify-center rounded-md border border-metallic-silver/35 bg-surface-elevated text-sm font-black text-white">
                  {brand.shortName}
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-white">
                  {brand.shortName}
                </span>
              </Link>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                className="incar-focus min-h-10 rounded-md border border-border px-3 text-sm font-semibold text-metallic-silver transition hover:bg-white/[0.04] hover:text-white"
              >
                Close
              </button>
            </div>

            <nav className="grid gap-1 px-5 py-5 text-base font-semibold text-metallic-silver">
              {mainNavigation.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`incar-focus rounded-md px-3 py-3 transition ${
                      active
                        ? "border border-metallic-silver/24 bg-background text-white"
                        : "hover:bg-background hover:text-white"
                    }`}
                  >
                    {locale === "ar" ? item.arLabel : item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-border px-5 py-5">
              <button
                type="button"
                onClick={toggleLocale}
                className="incar-focus mb-3 min-h-11 w-full rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver transition hover:bg-background hover:text-white"
              >
                {locale === "en" ? "العربية" : "EN"}
              </button>
              <Link
                href="/rfq"
                onClick={() => setOpen(false)}
                className="incar-focus inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover"
              >
                {quoteLabel}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
