"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { mainNavigation } from "@/config/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useRfq } from "@/contexts/RfqContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref, stripLocaleFromPathname } from "@/i18n/routing";
import { LanguageSwitcher } from "../LanguageSwitcher";

const CLOSE_DURATION_MS = 200;
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const mobileNavigation = [
  ...mainNavigation,
  { key: "contact" as const, href: "/contact" },
];

function isActivePath(pathname: string, href: string) {
  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  return pathWithoutLocale === href || pathWithoutLocale.startsWith(`${href}/`);
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const { locale, direction } = useLocale();
  const { itemCount } = useRfq();
  const dictionary = getDictionary(locale);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setRendered(true);
    window.requestAnimationFrame(() => setOpen(true));
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setRendered(false);
      triggerRef.current?.focus();
    }, CLOSE_DURATION_MS);
  }, []);

  useEffect(() => {
    if (!rendered) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!drawerRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    }

    const scrollPosition = window.scrollY;
    const bodyStyle = document.body.style;
    const previousBodyStyle = {
      overflow: bodyStyle.overflow,
      position: bodyStyle.position,
      top: bodyStyle.top,
      width: bodyStyle.width,
      paddingRight: bodyStyle.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.addEventListener("keydown", handleKeyDown);
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollPosition}px`;
    bodyStyle.width = "100%";
    if (scrollbarWidth > 0) bodyStyle.paddingRight = `${scrollbarWidth}px`;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      bodyStyle.overflow = previousBodyStyle.overflow;
      bodyStyle.position = previousBodyStyle.position;
      bodyStyle.top = previousBodyStyle.top;
      bodyStyle.width = previousBodyStyle.width;
      bodyStyle.paddingRight = previousBodyStyle.paddingRight;
      window.scrollTo(0, scrollPosition);
    };
  }, [closeMenu, rendered]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    function closeAtDesktop(event: MediaQueryListEvent) {
      if (!event.matches) return;
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setOpen(false);
      setRendered(false);
    }

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  const drawer = rendered ? (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <button
        type="button"
        tabIndex={-1}
        aria-label={dictionary.navigation.closeMenu}
        onClick={closeMenu}
        className={`absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-200 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={drawerRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label={dictionary.navigation.menu}
        dir={direction}
        className={`absolute inset-y-0 flex h-[100dvh] w-[85vw] flex-col overflow-hidden bg-surface shadow-[0_0_60px_rgba(0,0,0,0.7)] transition-transform ease-out motion-reduce:transition-none ${
          direction === "rtl"
            ? `right-0 border-l border-metallic-silver/20 ${open ? "translate-x-0" : "translate-x-full"}`
            : `left-0 border-r border-metallic-silver/20 ${open ? "translate-x-0" : "-translate-x-full"}`
        } ${open ? "duration-[220ms]" : "duration-200"}`}
      >
        <div className="relative flex min-h-16 items-center justify-between px-5">
          <div>
            <span className="block text-[13px] font-black tracking-[0.11em] text-white">
              INCAR AUTO PARTS
            </span>
            <span aria-hidden="true" className="mt-2 flex items-center gap-2">
              <span className="h-px w-5 bg-primary/80" />
              <span className="h-px w-12 bg-metallic-silver/20" />
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={dictionary.navigation.closeMenu}
            onClick={closeMenu}
            className="inline-flex size-11 items-center justify-center rounded-md border border-metallic-silver/15 bg-background/50 text-lg text-soft-silver transition hover:border-metallic-silver/35 hover:bg-white/[0.04] focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-[0.97] active:bg-white/[0.06]"
          >
            <span aria-hidden="true">×</span>
          </button>
          <span className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-metallic-silver/20 to-transparent" />
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <nav
            aria-label={dictionary.navigation.menu}
            className="grid text-base leading-6 text-metallic-silver"
          >
            {mobileNavigation.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.key}
                  href={localizeHref(locale, item.href)}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                  className={`incar-focus relative flex min-h-[52px] items-center justify-between border-b border-metallic-silver/[0.08] px-3 py-2.5 transition last:border-b-0 hover:bg-white/[0.025] hover:text-white ${
                    active ? "font-bold text-white" : "font-semibold"
                  }`}
                >
                  {active ? (
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-3 w-0.5 rounded-full bg-primary ${
                        direction === "rtl" ? "right-0" : "left-0"
                      }`}
                    />
                  ) : null}
                  <span>{dictionary.navigation[item.key]}</span>
                  <span aria-hidden="true" className="text-lg font-normal text-metallic-silver/45">
                    {direction === "rtl" ? "‹" : "›"}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="my-3 h-px bg-gradient-to-r from-transparent via-metallic-silver/20 to-transparent" />

          <div className="grid gap-2">
            <Link
              href={localizeHref(locale, "/rfq/upload-list")}
              onClick={closeMenu}
              className="incar-focus inline-flex min-h-12 items-center justify-center rounded-md border border-metallic-silver/20 bg-background/45 px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/40 hover:bg-surface-elevated hover:text-white"
            >
              {dictionary.navigation.uploadPartsList}
            </Link>
            <Link
              href={localizeHref(locale, "/rfq")}
              aria-label={`${dictionary.navigation.mobileRfq}${itemCount > 0 ? ` (${itemCount})` : ""}`}
              onClick={closeMenu}
              className="incar-focus inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              {dictionary.navigation.mobileRfq}
            </Link>
          </div>

          <div className="mt-3 border-t border-metallic-silver/15 pt-3">
            <LanguageSwitcher fullWidth onSelect={closeMenu} />
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={dictionary.navigation.menu}
        aria-controls={menuId}
        aria-expanded={open}
        onClick={openMenu}
        className="incar-focus inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver transition hover:border-metallic-silver/40 hover:text-white"
      >
        <span aria-hidden="true" className="grid w-4 gap-1">
          <span className="h-px w-4 bg-current" />
          <span className="h-px w-4 bg-current" />
          <span className="h-px w-4 bg-current" />
        </span>
        <span>{dictionary.navigation.menu}</span>
      </button>
      {typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
    </div>
  );
}
