"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { lookupOrder } from "../api/client";
import { OrderApiError } from "../api/errors";
import type { PublicOrderResponse } from "../api/contracts";
import { OrderSummaryView } from "./OrderSummaryView";

type LookupState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; order: PublicOrderResponse }
  | { kind: "not-found" }
  | { kind: "rate-limit" }
  | { kind: "error" };

export function OrderLookupPage() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.ordersLookup;
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<LookupState>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "loading" });
    try {
      const result = await lookupOrder(reference.trim(), email.trim());
      if (result.found) {
        setState({ kind: "found", order: result.order });
      } else {
        setState({ kind: "not-found" });
      }
    } catch (error) {
      if (error instanceof OrderApiError && error.kind === "rate-limit") {
        setState({ kind: "rate-limit" });
      } else {
        setState({ kind: "error" });
      }
    }
  }

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="incar-card-elevated mx-auto max-w-2xl rounded-lg p-6 md:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{copy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{copy.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{copy.description}</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-white">
            {copy.referenceLabel}
            <input
              required
              dir="ltr"
              placeholder={copy.referencePlaceholder}
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className="incar-input min-h-11 px-4 text-sm"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-white">
            {copy.emailLabel}
            <input
              required
              type="email"
              dir="ltr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="incar-input min-h-11 px-4 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={state.kind === "loading"}
            className="incar-focus min-h-11 w-fit rounded-md bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.kind === "loading" ? copy.submitting : copy.submit}
          </button>
        </form>

        {state.kind === "not-found" ? (
          <p className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-white" role="alert">
            {copy.notFound}
          </p>
        ) : null}
        {state.kind === "rate-limit" ? (
          <p className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-white" role="alert">
            {copy.rateLimit}
          </p>
        ) : null}
        {state.kind === "error" ? (
          <p className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-white" role="alert">
            {copy.genericError}
          </p>
        ) : null}

        {state.kind === "found" ? (
          <div className="mt-8">
            <OrderSummaryView
              order={state.order}
              allowResubmit
              onOrderUpdated={(order) => setState({ kind: "found", order })}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
