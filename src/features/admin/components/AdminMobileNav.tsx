"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { adminLogout } from "@/features/admin/api/client";
import { clearStoredAdminUsername, useStoredAdminUsername } from "../lib/admin-session-storage";
import { AdminNavList } from "./AdminNavList";

const CLOSE_DURATION_MS = 200;
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const username = useStoredAdminUsername();
  const [loggingOut, setLoggingOut] = useState(false);
  const menuId = useId();
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

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await adminLogout();
    } catch {
      // Session was already invalid — proceed to the login screen regardless.
    } finally {
      clearStoredAdminUsername();
      closeMenu();
      router.push("/admin/login");
    }
  }

  const drawer = rendered ? (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close menu"
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
        aria-label="Admin menu"
        className={`absolute inset-y-0 left-0 flex h-[100dvh] w-[85vw] max-w-xs flex-col overflow-hidden border-r border-metallic-silver/20 bg-surface shadow-[0_0_60px_rgba(0,0,0,0.7)] transition-transform ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${open ? "duration-[220ms]" : "duration-200"}`}
      >
        <div className="relative flex min-h-16 items-center justify-between px-5">
          <span className="text-[13px] font-black tracking-[0.11em] text-white">INCAR ADMIN</span>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="inline-flex size-11 items-center justify-center rounded-md border border-metallic-silver/15 bg-background/50 text-lg text-soft-silver transition hover:border-metallic-silver/35 hover:bg-white/[0.04] focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-[0.97] active:bg-white/[0.06]"
          >
            <span aria-hidden="true">×</span>
          </button>
          <span className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-metallic-silver/20 to-transparent" />
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <AdminNavList onNavigate={closeMenu} />
        </div>

        <div className="border-t border-metallic-silver/15 px-5 py-4">
          <p className="truncate text-xs text-muted">
            Signed in as{" "}
            <span className="font-semibold text-metallic-silver">{username ?? "Admin"}</span>
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="incar-focus mt-2 min-h-11 w-full rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:bg-surface-muted hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-border bg-surface px-4 py-3 lg:hidden">
      <div className="justify-self-start">
        <button
          ref={triggerRef}
          type="button"
          aria-label="Open menu"
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
          <span>Menu</span>
        </button>
      </div>

      <Link
        href="/admin/requests"
        className="incar-focus justify-self-center rounded-md px-2 py-2 text-sm font-black tracking-[0.12em] text-white"
      >
        INCAR ADMIN
      </Link>

      <div aria-hidden="true" />

      {typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
    </div>
  );
}
