"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";

export function HeaderSearch({
  compact = false,
  wide = false,
}: {
  compact?: boolean;
  wide?: boolean;
}) {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  if (compact) {
    return (
      <a
        href={localizeHref(locale, "/parts")}
        aria-label={dictionary.navigation.search}
        className="incar-focus inline-flex size-11 items-center justify-center rounded-md border border-border text-sm font-bold text-metallic-silver transition hover:bg-black/[0.04] hover:text-ink"
      >
        <span aria-hidden="true">⌕</span>
      </a>
    );
  }

  if (wide) {
    return (
      <form
        action={localizeHref(locale, "/parts")}
        className="flex w-full items-stretch"
        role="search"
      >
        <label className="sr-only" htmlFor="header-part-search">
          {dictionary.navigation.searchPartNumber}
        </label>
        <input
          id="header-part-search"
          name="q"
          dir="auto"
          placeholder={dictionary.navigation.searchPartNumber}
          className="min-h-11 w-full min-w-0 rounded-s-md border-0 bg-white px-4 text-sm text-ink outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="incar-focus min-h-11 shrink-0 rounded-e-md bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
        >
          {dictionary.navigation.search}
        </button>
      </form>
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
        className="min-h-11 w-24 min-w-0 rounded-s-md border border-e-0 border-border bg-background px-3 text-xs text-ink outline-none focus:border-primary 2xl:w-36"
      />
      <button
        type="submit"
        className="incar-focus min-h-11 rounded-e-md border border-border bg-surface-elevated px-3 text-xs font-semibold text-metallic-silver transition hover:text-ink"
      >
        {dictionary.navigation.search}
      </button>
    </form>
  );
}
