"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { localeCookieName, localeConfig } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";
import { switchLocalePathname } from "@/i18n/routing";

type LanguageSwitcherProps = {
  fullWidth?: boolean;
  onSelect?: () => void;
  /** Renders on dark surfaces (navy header): light inactive text. */
  dark?: boolean;
};

export function LanguageSwitcher({
  fullWidth = false,
  onSelect,
  dark = false,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  function selectLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      onSelect?.();
      return;
    }

    onSelect?.();
    window.localStorage.setItem(localeCookieName, nextLocale);
    const nextPathname = switchLocalePathname(pathname, nextLocale);
    window.location.assign(
      `${nextPathname}${window.location.search}${window.location.hash}`,
    );
  }

  return (
    <div
      aria-label={dictionary.language.switchLabel}
      className={`flex rounded-md border ${
        dark ? "border-white/20 bg-white/5" : "border-border bg-surface"
      } ${fullWidth ? "w-full p-0.5" : "p-1"}`}
    >
      {(["ar", "en"] as const).map((item) => {
        const active = locale === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => selectLocale(item)}
            className={`incar-focus rounded-sm text-sm font-semibold transition ${
              fullWidth ? "min-h-11 flex-1 px-2" : "min-h-9 px-3"
            } ${
              active
                ? "bg-primary text-white"
                : dark
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-metallic-silver hover:bg-black/[0.05] hover:text-ink"
            }`}
          >
            {localeConfig[item].label}
          </button>
        );
      })}
    </div>
  );
}
