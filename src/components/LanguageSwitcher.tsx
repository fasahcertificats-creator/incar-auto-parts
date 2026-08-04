"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { localeCookieName, localeConfig } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";
import { switchLocalePathname } from "@/i18n/routing";

type LanguageSwitcherProps = {
  fullWidth?: boolean;
};

export function LanguageSwitcher({ fullWidth = false }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  function selectLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    window.localStorage.setItem(localeCookieName, nextLocale);
    const nextPathname = switchLocalePathname(pathname, nextLocale);
    window.location.assign(
      `${nextPathname}${window.location.search}${window.location.hash}`,
    );
  }

  return (
    <div
      aria-label={dictionary.language.switchLabel}
      className={`flex rounded-md border border-border bg-background/40 p-1 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {(["ar", "en"] as const).map((item) => {
        const active = locale === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => selectLocale(item)}
            className={`incar-focus min-h-9 rounded-sm px-3 text-sm font-semibold transition ${
              fullWidth ? "flex-1" : ""
            } ${
              active
                ? "bg-primary text-white"
                : "text-metallic-silver hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            {localeConfig[item].label}
          </button>
        );
      })}
    </div>
  );
}
