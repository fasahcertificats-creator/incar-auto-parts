"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { useCart } from "../cart-context";
import { getBankDetails, submitOrder } from "../api/client";
import { OrderApiError, type OrderErrorKind } from "../api/errors";
import type { BankDetailsResponse } from "../api/contracts";

type FormState = {
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: "" | "Saudi Arabia" | "United Arab Emirates";
  postalCode: string;
  customerNotes: string;
};

const initialForm: FormState = {
  contactName: "",
  phone: "",
  whatsapp: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  country: "",
  postalCode: "",
  customerNotes: "",
};

function errorCopyKey(kind: OrderErrorKind): string {
  switch (kind) {
    case "validation":
      return "validation";
    case "receipt-unavailable":
      return "receiptUnavailable";
    case "not-found":
      return "notFound";
    case "conflict":
      return "conflict";
    case "payload-too-large":
      return "payloadTooLarge";
    case "unsupported-media-type":
      return "unsupportedMediaType";
    case "rate-limit":
      return "rateLimit";
    case "server-unavailable":
      return "serverUnavailable";
    case "network":
      return "network";
    case "timeout":
      return "timeout";
    case "server":
      return "server";
    default:
      return "unknown";
  }
}

export function CheckoutFlow() {
  const router = useRouter();
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.checkout;
  const { items, subtotalUsd, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(initialForm);
  const [bankDetails, setBankDetails] = useState<BankDetailsResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    getBankDetails()
      .then(setBankDetails)
      .catch(() => setBankDetails({ available: false, bankName: null, accountNumber: null, iban: null, swift: null, accountHolder: null }));
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setFieldError(null);

    if (items.length === 0) {
      setErrorMessage(copy.emptyCart);
      return;
    }

    const proof = fileInputRef.current?.files?.[0];
    if (!proof) {
      setFieldError(copy.payment.proofRequired);
      return;
    }

    if (!form.country) {
      setFieldError(copy.errors.validation);
      return;
    }

    setSubmitting(true);
    try {
      const order = await submitOrder(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        {
          contactName: form.contactName,
          phone: form.phone,
          whatsapp: form.whatsapp.trim() || null,
          email: form.email,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2.trim() || null,
          city: form.city,
          country: form.country,
          postalCode: form.postalCode.trim() || null,
          customerNotes: form.customerNotes.trim() || null,
        },
        proof,
      );
      clearCart();
      router.push(`${localizeHref(locale, "/checkout/confirmation")}?ref=${encodeURIComponent(order.publicReference)}`);
    } catch (error) {
      if (error instanceof OrderApiError) {
        const key = errorCopyKey(error.kind);
        const message = (copy.errors as Record<string, string>)[key] ?? copy.errors.unknown;
        setErrorMessage(
          error.kind === "rate-limit" && error.retryAfterSeconds
            ? `${message} ${copy.errors.retryAfter.replace("{seconds}", String(error.retryAfterSeconds))}`
            : message,
        );
      } else {
        setErrorMessage(copy.errors.unknown);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="incar-card-elevated mx-auto max-w-3xl rounded-lg p-6 text-center md:p-9">
          <h1 className="text-3xl font-semibold text-white">{copy.title}</h1>
          <p className="mt-4 text-sm text-muted">{copy.emptyCart}</p>
          <Link
            href={localizeHref(locale, "/cart")}
            className="incar-focus mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {copy.backToCart}
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
        <Link
          href={localizeHref(locale, "/cart")}
          className="incar-focus mt-4 inline-flex text-sm font-semibold text-metallic-silver hover:text-white"
        >
          {copy.backToCart}
        </Link>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8">
          <fieldset className="incar-card grid gap-4 rounded-lg p-6">
            <legend className="px-1 text-lg font-semibold text-white">{copy.contact.title}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-white">
                {copy.contact.contactName}
                <input
                  required
                  value={form.contactName}
                  onChange={(event) => updateField("contactName", event.target.value)}
                  className="incar-input min-h-11 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white">
                {copy.contact.phone}
                <input
                  required
                  dir="ltr"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="incar-input min-h-11 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white">
                {copy.contact.whatsapp}
                <input
                  dir="ltr"
                  value={form.whatsapp}
                  onChange={(event) => updateField("whatsapp", event.target.value)}
                  className="incar-input min-h-11 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white">
                {copy.contact.email}
                <input
                  required
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="incar-input min-h-11 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">
                {copy.contact.addressLine1}
                <input
                  required
                  value={form.addressLine1}
                  onChange={(event) => updateField("addressLine1", event.target.value)}
                  className="incar-input min-h-11 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">
                {copy.contact.addressLine2}
                <input
                  value={form.addressLine2}
                  onChange={(event) => updateField("addressLine2", event.target.value)}
                  className="incar-input min-h-11 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white">
                {copy.contact.city}
                <input
                  required
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className="incar-input min-h-11 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white">
                {copy.contact.country}
                <select
                  required
                  value={form.country}
                  onChange={(event) => updateField("country", event.target.value as FormState["country"])}
                  className="incar-input min-h-11 px-4 text-sm"
                >
                  <option value="">{copy.contact.countryPlaceholder}</option>
                  <option value="Saudi Arabia">{copy.contact.countries.SA}</option>
                  <option value="United Arab Emirates">{copy.contact.countries.AE}</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white">
                {copy.contact.postalCode}
                <input
                  value={form.postalCode}
                  onChange={(event) => updateField("postalCode", event.target.value)}
                  className="incar-input min-h-11 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">
                {copy.contact.notes}
                <textarea
                  rows={3}
                  value={form.customerNotes}
                  onChange={(event) => updateField("customerNotes", event.target.value)}
                  className="incar-input px-4 py-3 text-sm"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="incar-card grid gap-4 rounded-lg p-6">
            <legend className="px-1 text-lg font-semibold text-white">{copy.payment.title}</legend>
            <p className="text-sm text-muted">{copy.payment.description}</p>
            {bankDetails?.available ? (
              <dl className="grid gap-3 rounded-md bg-background p-4 sm:grid-cols-2">
                {bankDetails.bankName ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.payment.bankName}</dt>
                    <dd className="mt-1 text-white">{bankDetails.bankName}</dd>
                  </div>
                ) : null}
                {bankDetails.accountHolder ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.payment.accountHolder}</dt>
                    <dd className="mt-1 text-white">{bankDetails.accountHolder}</dd>
                  </div>
                ) : null}
                {bankDetails.accountNumber ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.payment.accountNumber}</dt>
                    <dd dir="ltr" className="mt-1 text-white">{bankDetails.accountNumber}</dd>
                  </div>
                ) : null}
                {bankDetails.iban ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.payment.iban}</dt>
                    <dd dir="ltr" className="mt-1 text-white">{bankDetails.iban}</dd>
                  </div>
                ) : null}
                {bankDetails.swift ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.payment.swift}</dt>
                    <dd dir="ltr" className="mt-1 text-white">{bankDetails.swift}</dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-white">
                {copy.payment.unavailable}
              </p>
            )}

            <label className="mt-2 grid gap-2 text-sm font-semibold text-white">
              {copy.payment.proofLabel}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                className="text-sm text-metallic-silver"
              />
            </label>
            {fieldError ? <p className="text-sm text-primary">{fieldError}</p> : null}
          </fieldset>

          <div className="incar-card rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white">{copy.summary.title}</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-muted">
              <span>{copy.summary.subtotal}</span>
              <span dir="ltr" className="font-semibold text-white">${subtotalUsd.toFixed(2)} USD</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold text-white">
              <span>{copy.summary.total}</span>
              <span dir="ltr">${subtotalUsd.toFixed(2)} USD</span>
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="incar-focus min-h-12 w-fit rounded-md bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? copy.submitting : copy.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
