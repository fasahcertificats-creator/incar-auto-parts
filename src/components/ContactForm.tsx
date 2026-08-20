"use client";

import type { FormEvent } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { useInquirySubmission } from "@/features/inquiries/hooks/useInquirySubmission";
import type { ContactInquiryPayload } from "@/features/inquiries/api/contracts";

const inputClass =
  "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";

export function ContactForm() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const { state, errorMessage, retryBlocked, response, submit } = useInquirySubmission();

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

    const succeeded = await submit(payload);
    if (succeeded) form.reset();
  }

  return (
    <form className="incar-card rounded-lg p-5 md:p-7" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {dictionary.forms.common.fullName}
          <input className={inputClass} name="fullName" required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.company}
          <input className={inputClass} name="companyName" required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.email}
          <input type="email" className={inputClass} name="email" required />
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
        className="incar-focus mt-6 min-h-12 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "submitting" ? dictionary.forms.common.submitting : dictionary.forms.common.submitInquiry}
      </button>
    </form>
  );
}
