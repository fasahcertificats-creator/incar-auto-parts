"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
import { RFQProvider } from "@/features/rfq/rfq-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <RFQProvider>{children}</RFQProvider>
    </LocaleProvider>
  );
}
