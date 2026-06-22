"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Locale = "en" | "ar";

type LocaleContextValue = {
  locale: Locale;
  direction: "ltr" | "rtl";
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const storageKey = "incar-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const hydratedRef = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = window.localStorage.getItem(storageKey);
      hydratedRef.current = true;

      if (stored === "ar" || stored === "en") {
        setLocale(stored);
      } else {
        window.localStorage.setItem(storageKey, "en");
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const direction = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;

    if (hydratedRef.current) {
      window.localStorage.setItem(storageKey, locale);
    }
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === "en" ? "ar" : "en"));
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: locale === "ar" ? "rtl" : "ltr",
      toggleLocale,
    }),
    [locale, toggleLocale],
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
