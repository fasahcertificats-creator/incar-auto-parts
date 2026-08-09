"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import type { RFQFormData } from "@/types/rfq";
import {
  clearAttempt,
  getOrCreateAttempt,
  invalidateAttempt,
  markAttemptRetryable,
} from "../api/attempt.ts";
import { submitProductRfq } from "../api/client.ts";
import {
  retryDelayMilliseconds,
  RfqApiError,
  type RfqErrorKind,
} from "../api/errors.ts";
import {
  mapProductRfqPayload,
  validateProductRfqDraft,
  type RfqDraftValidationCode,
} from "../api/mapper.ts";
import { useRFQ } from "../use-rfq";

const inputClass = "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";
type SubmissionState = "idle" | "submitting" | "success" | "recoverable-error";

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function RFQForm() {
  const { items, clearRFQ } = useRFQ();
  const { locale } = useLocale();
  const router = useRouter();
  const dictionary = getDictionary(locale);
  const copy = dictionary.forms.rfq;
  const integration = copy.integration;
  const [state, setState] = useState<SubmissionState>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [retryBlocked, setRetryBlocked] = useState(false);
  const submissionGuardRef = useRef(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const retryTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
  }, []);

  const defaultInterestedProducts = useMemo(
    () => items.map((item) => item.partNumber || item.oemNumber).filter(Boolean).join(", "),
    [items],
  );

  function validationMessage(code: RfqDraftValidationCode) {
    const messages: Record<RfqDraftValidationCode, string> = {
      "contact-name": integration.errors.contactName,
      "company-name": integration.errors.companyName,
      "country-code": integration.errors.countryCode,
      email: integration.errors.email,
      items: integration.errors.items,
      "item-limit": integration.errors.itemLimit,
      "item-reference": integration.errors.itemReference,
      quantity: integration.errors.quantity,
      privacy: integration.errors.privacy,
      compatibility: integration.errors.compatibility,
    };
    return messages[code];
  }

  function apiErrorMessage(kind: RfqErrorKind) {
    const messages: Record<RfqErrorKind, string> = {
      configuration: integration.errors.configuration,
      validation: integration.errors.validation,
      "receipt-unavailable": integration.errors.unknown,
      "idempotency-conflict": integration.errors.conflict,
      "submission-in-progress": integration.errors.inProgress,
      "mapping-locked": integration.errors.unknown,
      "inspection-invalid": integration.errors.unknown,
      "mapping-invalid": integration.errors.validation,
      "payload-too-large": integration.errors.payloadTooLarge,
      "unsupported-media-type": integration.errors.unsupported,
      "rate-limit": integration.errors.rateLimit,
      capacity: integration.errors.capacity,
      "reference-generation": integration.errors.reference,
      network: integration.errors.network,
      server: integration.errors.server,
      unknown: integration.errors.unknown,
    };
    return messages[kind];
  }

  function showErrors(nextErrors: string[]) {
    setErrors(nextErrors);
    setState("recoverable-error");
    window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionGuardRef.current) return;

    const data = new FormData(event.currentTarget);
    const formValues: RFQFormData = {
      fullName: getText(data, "fullName"),
      companyName: getText(data, "companyName"),
      countryCode: getText(data, "countryCode"),
      city: getText(data, "city"),
      email: getText(data, "email"),
      whatsapp: getText(data, "whatsapp"),
      businessType: getText(data, "businessType") as RFQFormData["businessType"],
      interestedProductsText: getText(data, "interestedProductsText"),
      requestedQuantityText: getText(data, "requestedQuantityText"),
      message: getText(data, "message"),
      privacyConsent: data.get("privacyConsent") === "accepted",
    };
    const validationCodes = validateProductRfqDraft({ locale, formData: formValues, items });
    if (validationCodes.length > 0) {
      showErrors(validationCodes.map(validationMessage));
      return;
    }

    const payload = mapProductRfqPayload({ locale, formData: formValues, items });
    submissionGuardRef.current = true;
    setState("submitting");
    setErrors([]);

    try {
      const attempt = await getOrCreateAttempt(payload);
      await submitProductRfq(payload, attempt.idempotencyKey);
      setState("success");
      clearAttempt();
      clearRFQ();
      router.push(localizeHref(locale, "/rfq/confirmation"));
    } catch (error) {
      const apiError = error instanceof RfqApiError
        ? error
        : new RfqApiError("unknown", null, null);
      if (apiError.kind === "idempotency-conflict") {
        invalidateAttempt();
      } else {
        const attempt = await getOrCreateAttempt(payload);
        markAttemptRetryable(attempt);
      }
      const nextErrors = [apiErrorMessage(apiError.kind)];
      const retryDelay = retryDelayMilliseconds(apiError);
      if (retryDelay > 0 && apiError.retryAfterSeconds !== null) {
        setRetryBlocked(true);
        if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = window.setTimeout(() => {
          retryTimerRef.current = null;
          setRetryBlocked(false);
        }, retryDelay);
        nextErrors.push(
          integration.retryAfter.replace("{seconds}", String(apiError.retryAfterSeconds)),
        );
      }
      showErrors(nextErrors);
    } finally {
      submissionGuardRef.current = false;
    }
  }

  return (
    <form className="incar-card rounded-lg p-5 md:p-7" onSubmit={handleSubmit} noValidate>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">{copy.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{integration.description}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className={labelClass} htmlFor="rfq-full-name">
          {dictionary.forms.common.fullName}
          <input id="rfq-full-name" className={inputClass} name="fullName" autoComplete="name" maxLength={150} required />
        </label>
        <label className={labelClass} htmlFor="rfq-company-name">
          {dictionary.forms.common.companyName}
          <input id="rfq-company-name" className={inputClass} name="companyName" autoComplete="organization" maxLength={200} required />
        </label>
        <label className={labelClass} htmlFor="rfq-country-code">
          {integration.countryCode}
          <input
            id="rfq-country-code"
            className={inputClass}
            name="countryCode"
            placeholder={integration.countryCodePlaceholder}
            minLength={2}
            maxLength={2}
            autoCapitalize="characters"
            required
          />
        </label>
        <label className={labelClass} htmlFor="rfq-city">
          {dictionary.forms.common.city}
          <input id="rfq-city" className={inputClass} name="city" autoComplete="address-level2" maxLength={120} />
        </label>
        <label className={labelClass} htmlFor="rfq-email">
          {dictionary.forms.common.email}
          <input id="rfq-email" className={inputClass} type="email" name="email" autoComplete="email" maxLength={320} required />
        </label>
        <label className={labelClass} htmlFor="rfq-whatsapp">
          {dictionary.forms.common.whatsapp}
          <input id="rfq-whatsapp" className={inputClass} name="whatsapp" autoComplete="tel" placeholder="+966" maxLength={50} />
        </label>
        <label className={labelClass} htmlFor="rfq-business-type">
          {integration.businessType}
          <select id="rfq-business-type" className={inputClass} name="businessType" defaultValue="">
            <option value="">{integration.businessTypes.empty}</option>
            <option value="importer">{integration.businessTypes.importer}</option>
            <option value="wholesaler">{integration.businessTypes.wholesaler}</option>
            <option value="distributor">{integration.businessTypes.distributor}</option>
            <option value="workshop">{integration.businessTypes.workshop}</option>
            <option value="retailer">{integration.businessTypes.retailer}</option>
            <option value="other">{integration.businessTypes.other}</option>
          </select>
        </label>
        <label className={labelClass} htmlFor="rfq-manual-reference">
          {integration.manualReference}
          <input
            id="rfq-manual-reference"
            className={inputClass}
            name="interestedProductsText"
            defaultValue={defaultInterestedProducts}
            placeholder={copy.productsPlaceholder}
            maxLength={120}
            readOnly={items.length > 0}
          />
          <span className="text-xs font-normal text-muted">{integration.manualReferenceHelp}</span>
        </label>
        {items.length === 0 ? (
          <label className={labelClass} htmlFor="rfq-quantity">
            {copy.quantity}
            <input
              id="rfq-quantity"
              className={inputClass}
              name="requestedQuantityText"
              type="number"
              min="1"
              max="999999"
              defaultValue="1"
            />
          </label>
        ) : null}
        <label className={`${labelClass} md:col-span-2`} htmlFor="rfq-message">
          {dictionary.forms.common.message}
          <textarea
            id="rfq-message"
            className="incar-input min-h-32 px-4 py-3 text-sm"
            name="message"
            placeholder={copy.messagePlaceholder}
            maxLength={4000}
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-white" htmlFor="rfq-privacy-consent">
        <input
          id="rfq-privacy-consent"
          type="checkbox"
          name="privacyConsent"
          value="accepted"
          className="mt-1 size-4 accent-primary"
        />
        <span>{integration.privacyConsent}</span>
      </label>

      {errors.length > 0 ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="incar-focus mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm leading-6 text-white"
        >
          <p className="font-semibold">{integration.errorTitle}</p>
          <ul className="mt-2 list-disc space-y-1 ps-5">
            {errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting" || state === "success" || retryBlocked}
        aria-busy={state === "submitting"}
        className="incar-focus mt-6 min-h-12 w-full rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {state === "submitting"
          ? integration.submitting
          : state === "recoverable-error"
            ? integration.retry
            : integration.submit}
      </button>
    </form>
  );
}
