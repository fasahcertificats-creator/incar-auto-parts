"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { getOrderReceipt } from "../api/client";
import { OrderApiError } from "../api/errors";
import type { PublicOrderResponse } from "../api/contracts";
import { OrderSummaryView } from "./OrderSummaryView";

type ReceiptState =
  | { kind: "loading" }
  | { kind: "success"; order: PublicOrderResponse }
  | { kind: "unavailable" }
  | { kind: "recoverable-error" };

export function CheckoutConfirmation() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.checkout.confirmation;
  const [state, setState] = useState<ReceiptState>({ kind: "loading" });

  const loadReceipt = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      setState({ kind: "success", order: await getOrderReceipt() });
    } catch (error) {
      if (error instanceof OrderApiError && error.kind === "receipt-unavailable") {
        setState({ kind: "unavailable" });
      } else {
        setState({ kind: "recoverable-error" });
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getOrderReceipt()
      .then((order) => {
        if (!cancelled) setState({ kind: "success", order });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof OrderApiError && error.kind === "receipt-unavailable") {
          setState({ kind: "unavailable" });
        } else {
          setState({ kind: "recoverable-error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="incar-card-elevated mx-auto max-w-3xl rounded-lg p-6 md:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{copy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{copy.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{copy.description}</p>

        {state.kind === "loading" ? (
          <p className="mt-8 text-sm text-metallic-silver" role="status" aria-live="polite">
            {copy.loading}
          </p>
        ) : null}

        {state.kind === "success" ? (
          <div className="mt-8">
            <OrderSummaryView order={state.order} />
          </div>
        ) : null}

        {state.kind === "unavailable" || state.kind === "recoverable-error" ? (
          <div className="mt-8 rounded-md border border-primary/30 bg-primary/10 p-5 text-sm leading-7 text-white" role="alert">
            <p>{state.kind === "unavailable" ? copy.unavailable : copy.loadError}</p>
            {state.kind === "recoverable-error" ? (
              <button
                type="button"
                onClick={() => void loadReceipt()}
                className="incar-focus mt-4 rounded-md border border-border px-4 py-2 font-semibold hover:border-metallic-silver/45"
              >
                {copy.retry}
              </button>
            ) : null}
            {state.kind === "unavailable" ? (
              <Link
                href={localizeHref(locale, "/orders/lookup")}
                className="incar-focus mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 font-semibold text-white hover:border-metallic-silver/45"
              >
                {copy.lookupCta}
              </Link>
            ) : null}
          </div>
        ) : null}

        <Link
          href={localizeHref(locale, "/parts")}
          className="incar-focus mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {copy.backToShop}
        </Link>
      </div>
    </section>
  );
}
