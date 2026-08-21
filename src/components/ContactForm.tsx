"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { useInquirySubmission } from "@/features/inquiries/hooks/useInquirySubmission";
import type { ContactInquiryPayload } from "@/features/inquiries/api/contracts";

const inputClass =
  "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

// Mirrors the backend's contactInquiryShape (fullName/companyName 1-150/200
// chars, a well-formed email) so obviously invalid input is caught before a
// round trip, the same way RFQForm validates against the RFQ contract.
function validateContactForm(
  payload: Pick<ContactInquiryPayload, "fullName" | "companyName" | "email">,
  dictionary: ReturnType<typeof getDictionary>,
) {
  const errors: string[] = [];
  const { errors: messages } = dictionary.forms.common;

  if (!payload.fullName || payload.fullName.length > 150) errors.push(messages.fullName);
  if (!payload.companyName || payload.companyName.length > 200) errors.push(messages.companyName);
  if (!EMAIL_PATTERN.test(payload.email) || payload.email.length > 320) errors.push(messages.email);

  return errors;
}

export function ContactForm() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const { state, errorMessage, retryBlocked, response, submit } = useInquirySubmission();
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (retryBlocked || state === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const getText = (field: string) => String(data.get(field) ?? "").trim();

    const payload: ContactInquiryPayload = {
      type: "contact",
      fullName: getText("fullName"),
      companyName: getText("companyName"),
      email: getText("email"),
      whatsapp: getText("whatsapp") || undefined,
      inquiryType: getText("inquiryType") || dictionary.pages.contact.types[0],
      message: getText("message") || undefined,
      locale,
    };

    const validationErrors = validateContactForm(payload, dictionary);
    setFieldErrors(validationErrors);
    if (validationErrors.length > 0) return;

    const succeeded = await submit(payload);
    if (succeeded) form.reset();
  }

  return (
    <form className="incar-card rounded-lg p-5 md:p-7" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {dictionary.forms.common.fullName}
          <input className={inputClass} name="fullName" maxLength={150} required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.company}
          <input className={inputClass} name="companyName" maxLength={200} required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.email}
          <input type="email" className={inputClass} name="email" maxLength={320} required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.whatsapp}
          <input className={inputClass} name="whatsapp" />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.common.inquiryType}
          <select className={inputClass} name="inquiryType" defaultValue={dictionary.pages.contact.types[0]}>
            {dictionary.pages.contact.types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.common.message}
          <textarea className="incar-input min-h-32 px-4 py-3 text-sm" name="message" />
        </label>
      </div>

      {fieldErrors.length > 0 ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm leading-6 text-soft-silver"
        >
          <ul className="list-disc space-y-1 ps-5">
            {fieldErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm leading-6 text-soft-silver"
        >
          {errorMessage}
        </div>
      ) : null}

      {state === "success" && response ? (
        <div className="mt-6 rounded-md border border-metallic-silver/24 bg-background p-4 text-sm leading-6 text-metallic-silver">
          <p>{dictionary.forms.common.submitted}</p>
          <p className="mt-2 font-semibold text-white">
            {dictionary.forms.common.reference}: {response.publicReference}
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting" || retryBlocked}
        aria-busy={state === "submitting"}
        className="incar-focus mt-6 min-h-12 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "submitting" ? dictionary.forms.common.submitting : dictionary.forms.common.submitInquiry}
      </button>
    </form>
  );
}
