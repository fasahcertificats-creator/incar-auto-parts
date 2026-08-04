"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { useRFQ } from "@/features/rfq/use-rfq";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";

export function ContinueRfqDraftLink() {
  const { itemCount } = useRFQ();
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  if (!itemCount) return null;

  return (
    <Link
      href={localizeHref(locale, "/rfq")}
      className="incar-focus inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
    >
      {dictionary.navigation.continueRfq}
    </Link>
  );
}
