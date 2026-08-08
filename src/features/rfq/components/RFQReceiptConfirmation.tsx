"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { getRfqReceipt } from "../api/client.ts";
import { RfqApiError } from "../api/errors.ts";
import type { RfqReceiptResponse } from "../api/contracts.ts";

type ReceiptState =
  | { kind: "loading" }
  | { kind: "success"; receipt: RfqReceiptResponse }
  | { kind: "unavailable" }
  | { kind: "recoverable-error" };

export function RFQReceiptConfirmation() {
  const { locale } = useLocale();
  const copy = getDictionary(locale).forms.rfq.integration.confirmation;
  const [state, setState] = useState<ReceiptState>({ kind: "loading" });

  const loadReceipt = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      setState({ kind: "success", receipt: await getRfqReceipt() });
    } catch (error) {
      if (error instanceof RfqApiError && error.kind === "receipt-unavailable") {
        setState({ kind: "unavailable" });
      } else {
        setState({ kind: "recoverable-error" });
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getRfqReceipt()
      .then((receipt) => {
        if (!cancelled) setState({ kind: "success", receipt });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof RfqApiError && error.kind === "receipt-unavailable") {
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
          <dl className="mt-8 grid gap-4 rounded-md border border-border bg-background p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.reference}</dt>
              <dd className="mt-2 text-xl font-semibold text-white" dir="ltr">{state.receipt.publicReference}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.status}</dt>
              <dd className="mt-2 text-white">{copy.submitted}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.submittedAt}</dt>
              <dd className="mt-2 text-white">
                {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
                  new Date(state.receipt.submittedAt),
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.requestType}</dt>
              <dd className="mt-2 text-white">
                {state.receipt.requestIntent === "compatibility-verification"
                  ? copy.compatibility
                  : copy.productRfq}
              </dd>
            </div>
          </dl>
        ) : null}

        {state.kind === "unavailable" || state.kind === "recoverable-error" ? (
          <div className="mt-8 rounded-md border border-primary/30 bg-primary/10 p-5 text-sm leading-7 text-white" role="alert">
            <p>{copy.unavailable}</p>
            {state.kind === "recoverable-error" ? (
              <button
                type="button"
                onClick={() => void loadReceipt()}
                className="incar-focus mt-4 rounded-md border border-border px-4 py-2 font-semibold hover:border-metallic-silver/45"
              >
                {copy.retry}
              </button>
            ) : null}
          </div>
        ) : null}

        <Link
          href={localizeHref(locale, "/rfq")}
          className="incar-focus mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {copy.back}
        </Link>
      </div>
    </section>
  );
}
