"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const inputClass =
  "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";

export function PrivateLabelForm() {
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
          Brand name
          <input className={inputClass} name="brandName" required />
        </label>
        <label className={labelClass}>
          Product category
          <input className={inputClass} name="category" placeholder="Filters, brake pads, suspension" />
        </label>
        <label className={labelClass}>
          Target market
          <input className={inputClass} name="market" placeholder="Middle Eastern target market" />
        </label>
        <label className={labelClass}>
          Estimated quantity
          <input className={inputClass} name="quantity" placeholder="Monthly or first order quantity" />
        </label>
        <label className={labelClass}>
          Do you already have a logo?
          <select className={inputClass} name="hasLogo">
            <option>Yes, logo files are ready</option>
            <option>Logo design support needed</option>
            <option>Not yet decided</option>
          </select>
        </label>
        <label className={labelClass}>
          Contact information
          <input className={inputClass} name="contact" placeholder="Email or WhatsApp" />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Packaging requirements
          <textarea
            className="incar-input min-h-32 px-4 py-3 text-sm"
            name="packaging"
            placeholder="Box style, label language, barcode, carton marks, MOQ target, and sample needs."
          />
        </label>
      </div>
      {submitted ? (
        <div className="mt-6 rounded-md border border-metallic-silver/24 bg-background p-4 text-sm leading-6 text-metallic-silver">
          Your private label inquiry has been prepared for review. Live submission can be connected in a later backend step.
        </div>
      ) : null}
      <button
        type="submit"
        className="incar-focus mt-6 min-h-12 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover"
      >
        Start Private Label Inquiry
      </button>
    </form>
  );
}
