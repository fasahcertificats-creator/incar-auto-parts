import { ar } from "./ar";
import { en } from "./en";
import { defaultLocale } from "../config";
import type { Locale } from "../types";

export const dictionaries = {
  ar,
  en,
};

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}
