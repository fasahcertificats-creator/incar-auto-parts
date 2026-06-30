import type { Direction, Locale } from "./types";

export const locales = ["ar", "en"] as const;
export const defaultLocale: Locale = "ar";
export const localeCookieName = "incar-locale";

export const localeConfig: Record<Locale, { label: string; direction: Direction }> = {
  ar: { label: "العربية", direction: "rtl" },
  en: { label: "English", direction: "ltr" },
};

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}

export function getDirection(locale: Locale): Direction {
  return localeConfig[locale].direction;
}
