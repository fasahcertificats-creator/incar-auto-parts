"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { resubmitPaymentProof } from "../api/client";
import type { PublicOrderResponse } from "../api/contracts";

export function OrderSummaryView({
  order,
  onOrderUpdated,
  allowResubmit = false,
}: {
  order: PublicOrderResponse;
  onOrderUpdated?: (order: PublicOrderResponse) => void;
  allowResubmit?: boolean;
}) {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.checkout.confirmation;
  const statusLabel = dictionary.checkout.statusLabels[order.status];

  return (
    <div>
      <dl className="grid gap-4 rounded-md border border-border bg-background p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.reference}</dt>
          <dd className="mt-2 break-all text-xl font-semibold text-white" dir="ltr">
            {order.publicReference}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.status}</dt>
          <dd className="mt-2 text-white">{statusLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.submittedAt}</dt>
          <dd className="mt-2 text-white">
            {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
              new Date(order.createdAt),
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.total}</dt>
          <dd dir="ltr" className="mt-2 text-white">
            ${order.totalUsd} USD
          </dd>
        </div>
      </dl>

      <div className="mt-6 rounded-md border border-border bg-background p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.items}</p>
        <ul className="mt-3 divide-y divide-border">
          {order.lineItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div>
                <p className="font-semibold text-white">{locale === "ar" ? item.nameAr : item.nameEn}</p>
                <p dir="ltr" className="text-xs text-muted">
                  {item.partNumber} · ×{item.quantity}
                </p>
              </div>
              <p dir="ltr" className="whitespace-nowrap font-semibold text-white">
                ${(Number(item.unitPriceUsd) * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-5 text-sm leading-7 text-white">
        {copy.teamNote}
      </p>

      {allowResubmit && order.status === "payment-rejected" ? (
        <ResubmitBlock order={order} onOrderUpdated={onOrderUpdated} />
      ) : null}
    </div>
  );
}

function ResubmitBlock({
  order,
  onOrderUpdated,
}: {
  order: PublicOrderResponse;
  onOrderUpdated?: (order: PublicOrderResponse) => void;
}) {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.ordersLookup.resubmit;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setSubmitting(true);
    setResult("idle");
    try {
      const updated = await resubmitPaymentProof(file);
      setResult("success");
      onOrderUpdated?.(updated);
    } catch (error) {
      void error;
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  void order;

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-md border border-border bg-background p-5">
      <h3 className="text-base font-semibold text-white">{copy.title}</h3>
      <p className="mt-1 text-sm text-muted">{copy.description}</p>
      <label className="mt-4 grid gap-2 text-sm font-semibold text-white">
        {copy.fileLabel}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="text-sm text-metallic-silver"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="incar-focus mt-4 min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? copy.submitting : copy.submit}
      </button>
      {result === "success" ? <p className="mt-3 text-sm text-emerald-400">{copy.success}</p> : null}
      {result === "error" ? <p className="mt-3 text-sm text-primary">{copy.error}</p> : null}
    </form>
  );
}
