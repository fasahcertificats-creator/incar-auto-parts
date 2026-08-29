"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { useCart } from "../cart-context";
import { getProductDetail } from "../api/client";
import { cartItemDisplayName } from "../contracts";

export function CartPage() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.cart.page;
  const { items, removeItem, updateQuantity, updatePrice, subtotalUsd } = useCart();
  const [revalidating, setRevalidating] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Deferred via .then() (rather than a synchronous setState call in the
    // effect body) — same rationale as RFQReceiptConfirmation's mount effect.
    void Promise.resolve().then(() => {
      if (!cancelled) setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    let cancelled = false;
    const nextNotices: string[] = [];

    void Promise.resolve()
      .then(() => {
        if (!cancelled) setRevalidating(true);
      })
      .then(() =>
        Promise.all(
          items.map(async (item) => {
            try {
              const detail = await getProductDetail(item.slug);
              if (!("availableForInstantPurchase" in detail) || !detail.availableForInstantPurchase) {
                if (!cancelled) removeItem(item.productId);
                nextNotices.push(copy.noLongerAvailable);
                return;
              }
              if (detail.directSalePriceUsd && detail.directSalePriceUsd !== item.unitPriceUsd) {
                if (!cancelled) updatePrice(item.productId, detail.directSalePriceUsd);
                nextNotices.push(copy.priceChanged);
              }
            } catch {
              nextNotices.push(copy.revalidateError);
            }
          }),
        ),
      )
      .finally(() => {
        if (!cancelled) {
          setRevalidating(false);
          setNotices([...new Set(nextNotices)]);
        }
      });

    return () => {
      cancelled = true;
    };
    // Only re-run when the hydrated snapshot's item identities change, not on
    // every quantity keystroke — that would refetch mid-edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, items.map((item) => item.productId).join(",")]);

  if (items.length === 0) {
    return (
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="incar-card-elevated mx-auto max-w-3xl rounded-lg p-6 text-center md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{copy.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{copy.title}</h1>
          <p className="mt-4 text-sm text-muted">{copy.empty}</p>
          {notices.map((notice) => (
            <p key={notice} className="mt-4 rounded-md border border-primary/30 bg-primary/10 p-4 text-start text-sm text-white" role="alert">
              {notice}
            </p>
          ))}
          <Link
            href={localizeHref(locale, "/parts")}
            className="incar-focus mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {copy.emptyCta}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{copy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{copy.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{copy.description}</p>

        {revalidating ? (
          <p className="mt-6 text-sm text-metallic-silver" role="status" aria-live="polite">
            {copy.revalidating}
          </p>
        ) : null}
        {notices.map((notice) => (
          <p key={notice} className="mt-4 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-white" role="alert">
            {notice}
          </p>
        ))}

        <div className="incar-card mt-6 divide-y divide-border rounded-lg">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-white">{cartItemDisplayName(item, locale)}</p>
                <p dir="ltr" className="mt-1 text-xs text-muted">
                  {copy.partNumber}: {item.partNumber || "—"}
                </p>
                <p dir="ltr" className="mt-1 text-sm text-metallic-silver">
                  ${Number(item.unitPriceUsd).toFixed(2)} USD
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-white">
                  {copy.quantity}
                  <input
                    type="number"
                    min={1}
                    max={999999}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.productId, Math.max(1, Math.floor(Number(event.target.value) || 1)))
                    }
                    className="incar-input min-h-10 w-20 px-3 text-sm"
                  />
                </label>
                <p dir="ltr" className="min-w-20 text-end font-semibold text-white">
                  ${(Number(item.unitPriceUsd) * item.quantity).toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="incar-focus rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-metallic-silver hover:text-white"
                >
                  {copy.remove}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-surface-elevated p-5">
          <p className="text-sm font-semibold text-white">{copy.subtotal}</p>
          <p dir="ltr" className="text-xl font-bold text-white">
            ${subtotalUsd.toFixed(2)} USD
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={localizeHref(locale, "/parts")}
            className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold text-metallic-silver hover:text-white"
          >
            {copy.continueShopping}
          </Link>
          <Link
            href={localizeHref(locale, "/checkout")}
            className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {copy.checkoutCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
