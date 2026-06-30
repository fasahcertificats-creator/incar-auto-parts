"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
import { RFQProvider } from "@/features/rfq/rfq-context";
import type { Locale } from "@/i18n/types";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <RFQProvider>{children}</RFQProvider>
    </LocaleProvider>
  );
}
