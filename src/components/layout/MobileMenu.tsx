"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { mainNavigation } from "@/config/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useRfq } from "@/contexts/RfqContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { LanguageSwitcher } from "../LanguageSwitcher";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { locale } = useLocale();
  const { itemCount } = useRfq();
  const dictionary = getDictionary(locale);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={dictionary.navigation.menu}
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="incar-focus inline-flex size-11 items-center justify-center rounded-md border border-border text-xs font-semibold text-metallic-silver"
      >
        {dictionary.navigation.menu}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm">
          <div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label={dictionary.navigation.menu}
            className="ms-auto flex h-full w-full max-w-sm flex-col border-s border-border bg-surface"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="text-sm font-bold text-white">INCAR</span>
              <button
                type="button"
                aria-label={dictionary.navigation.close}
                onClick={() => setOpen(false)}
                className="incar-focus min-h-11 rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver"
              >
                {dictionary.navigation.close}
              </button>
            </div>

            <nav className="grid gap-1 px-5 py-5 text-sm font-semibold text-metallic-silver">
              <Link
                href={localizeHref(locale, "/parts")}
                onClick={() => setOpen(false)}
                className="incar-focus min-h-11 rounded-md px-3 py-3 hover:bg-background hover:text-white"
              >
                {dictionary.navigation.search}
              </Link>
              {mainNavigation.slice(0, 2).map((item) => (
                <Link
                  key={item.key}
                  href={localizeHref(locale, item.href)}
                  onClick={() => setOpen(false)}
                  className="incar-focus min-h-11 rounded-md px-3 py-3 hover:bg-background hover:text-white"
                >
                  {dictionary.navigation[item.key]}
                </Link>
              ))}
              <Link
                href={localizeHref(locale, "/rfq/upload-list")}
                onClick={() => setOpen(false)}
                className="incar-focus min-h-11 rounded-md px-3 py-3 hover:bg-background hover:text-white"
              >
                {dictionary.navigation.uploadPartsList}
              </Link>
              {mainNavigation.slice(2).map((item) => (
                <Link
                  key={item.key}
                  href={localizeHref(locale, item.href)}
                  onClick={() => setOpen(false)}
                  className="incar-focus min-h-11 rounded-md px-3 py-3 hover:bg-background hover:text-white"
                >
                  {dictionary.navigation[item.key]}
                </Link>
              ))}
              <Link
                href={localizeHref(locale, "/contact")}
                onClick={() => setOpen(false)}
                className="incar-focus min-h-11 rounded-md px-3 py-3 hover:bg-background hover:text-white"
              >
                {dictionary.navigation.contact}
              </Link>
            </nav>

            <div className="mt-auto border-t border-border px-5 py-5">
              <LanguageSwitcher fullWidth />
              {itemCount > 0 ? (
                <Link
                  href={localizeHref(locale, "/rfq")}
                  onClick={() => setOpen(false)}
                  className="incar-focus mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
                >
                  {dictionary.navigation.continueRfq} ({itemCount})
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
