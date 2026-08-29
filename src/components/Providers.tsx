"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
import { CartProvider } from "@/features/cart/cart-context";
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
      <RFQProvider>
        <CartProvider>{children}</CartProvider>
      </RFQProvider>
    </LocaleProvider>
  );
}
