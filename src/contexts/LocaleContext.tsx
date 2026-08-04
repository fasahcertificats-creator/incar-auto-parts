"use client";

import { createContext, useContext, useMemo } from "react";
import { defaultLocale, getDirection } from "@/i18n/config";
import type { Direction, Locale } from "@/i18n/types";

type LocaleContextValue = {
  locale: Locale;
  direction: Direction;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: initialLocale,
      direction: getDirection(initialLocale),
    }),
    [initialLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return context;
}
