"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";

const inputClass =
  "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  return (
    <form
      className="incar-card rounded-lg p-5 md:p-7"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {dictionary.forms.common.fullName}
          <input className={inputClass} required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.company}
          <input className={inputClass} required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.email}
          <input type="email" className={inputClass} required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.whatsapp}
          <input className={inputClass} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.common.inquiryType}
          <select className={inputClass} defaultValue={dictionary.pages.contact.types[0]}>
            {dictionary.pages.contact.types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.common.message}
          <textarea className="incar-input min-h-32 px-4 py-3 text-sm" />
        </label>
      </div>
      {submitted ? (
        <div className="mt-6 rounded-md border border-metallic-silver/24 bg-background p-4 text-sm leading-6 text-metallic-silver">
          {dictionary.forms.common.mockInquiry}
        </div>
      ) : null}
      <button
        type="submit"
        className="incar-focus mt-6 min-h-12 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover"
      >
        {dictionary.forms.common.submitInquiry}
      </button>
    </form>
  );
}
