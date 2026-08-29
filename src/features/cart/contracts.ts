import type { LocalizedProductName } from "@/types/product";

/**
 * Client-side cart line item. Price is a display convenience only — it is
 * never trusted at checkout submission time; the server re-derives every
 * unit price from the live `products` row (see docs/phase-3b-plan.md §2).
 */
export type CartItem = {
  productId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  partNumber: string;
  unitPriceUsd: string;
  quantity: number;
};

export function cartItemDisplayName(item: CartItem, locale: "ar" | "en"): string {
  return locale === "ar" ? item.nameAr || item.nameEn : item.nameEn || item.nameAr;
}

export function localizedNameFor(name: LocalizedProductName, locale: "ar" | "en"): string {
  return name[locale] ?? name.en ?? name.ar;
}
