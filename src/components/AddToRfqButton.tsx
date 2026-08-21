"use client";

import Link from "next/link";
import { useState } from "react";
import { useRFQ } from "@/features/rfq/use-rfq";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { getProductById } from "@/lib/products";
import type { Product } from "@/types/product";

type AddToRfqButtonProps = {
  product?: Product;
  productId?: string;
  compact?: boolean;
};

export function AddToRfqButton({
  product,
  productId,
  compact = false,
}: AddToRfqButtonProps) {
  const { addItem } = useRFQ();
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const [added, setAdded] = useState(false);
  const rfqProduct = product ?? (productId ? getProductById(productId) : undefined);

  function handleClick() {
    if (!rfqProduct) return;

    addItem(rfqProduct);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}>
      <button
        type="button"
        onClick={handleClick}
        disabled={!rfqProduct}
        className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] transition hover:bg-primary-hover"
      >
        {added ? dictionary.common.addedToRfq : dictionary.common.addToRfq}
      </button>
      {!compact ? (
        <Link
          href={localizeHref(locale, "/rfq")}
          className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface-elevated px-4 py-2 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
        >
          {dictionary.common.requestQuotation}
        </Link>
      ) : null}
    </div>
  );
}
