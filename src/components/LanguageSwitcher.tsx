"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { localeCookieName, localeConfig } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";

type LanguageSwitcherProps = {
  fullWidth?: boolean;
};

const cookieMaxAge = 60 * 60 * 24 * 365;

export function LanguageSwitcher({ fullWidth = false }: LanguageSwitcherProps) {
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const dictionary = getDictionary(locale);
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  useEffect(() => {
    if (!pendingLocale) return;

    document.cookie = `${localeCookieName}=${pendingLocale}; path=/; max-age=${cookieMaxAge}; SameSite=Lax`;
    setLocale(pendingLocale);
    router.refresh();
  }, [pendingLocale, router, setLocale]);

  function selectLocale(nextLocale: Locale) {
    setPendingLocale(nextLocale);
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
