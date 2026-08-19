"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";

export function HeaderSearch({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  if (compact) {
    return (
      <a
        href={localizeHref(locale, "/parts")}
        aria-label={dictionary.navigation.search}
        className="incar-focus inline-flex size-11 items-center justify-center rounded-md border border-border text-sm font-bold text-metallic-silver transition hover:bg-white/[0.04] hover:text-white"
      >
        <span aria-hidden="true">⌕</span>
      </a>
    );
  }

  return (
    <form
      action={localizeHref(locale, "/parts")}
      className="hidden min-w-36 items-stretch lg:flex"
    >
      <label className="sr-only" htmlFor="header-part-search">
        {dictionary.navigation.searchPartNumber}
      </label>
      <input
        id="header-part-search"
        name="q"
        dir="ltr"
        placeholder="Part Number / OEM Reference"
        className="min-h-11 w-24 min-w-0 rounded-s-md border border-e-0 border-border bg-background px-3 text-xs text-white outline-none focus:border-primary 2xl:w-36"
      />
      <button
        type="submit"
        className="incar-focus min-h-11 rounded-e-md border border-border bg-surface-elevated px-3 text-xs font-semibold text-metallic-silver transition hover:text-white"
      >
        {dictionary.navigation.search}
      </button>
    </form>
  );
}
