"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const inputClass =
  "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

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
          Full name
          <input className={inputClass} required />
        </label>
        <label className={labelClass}>
          Company
          <input className={inputClass} required />
        </label>
        <label className={labelClass}>
          Email
          <input type="email" className={inputClass} required />
        </label>
        <label className={labelClass}>
          WhatsApp
          <input className={inputClass} placeholder="+966" />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Inquiry type
          <select className={inputClass} defaultValue="RFQ">
            <option>RFQ</option>
            <option>Private Label</option>
            <option>Catalog Request</option>
            <option>Sourcing Request</option>
            <option>Quality Control Question</option>
            <option>General Business Inquiry</option>
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Message
          <textarea className="incar-input min-h-32 px-4 py-3 text-sm" />
        </label>
      </div>
      {submitted ? (
        <div className="mt-6 rounded-md border border-metallic-silver/24 bg-background p-4 text-sm leading-6 text-metallic-silver">
          Your inquiry has been prepared for the INCAR team. This is a mock confirmation until live submission is connected.
        </div>
      ) : null}
      <button
        type="submit"
        className="incar-focus mt-6 min-h-12 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover"
      >
        Submit Inquiry
      </button>
    </form>
  );
}
