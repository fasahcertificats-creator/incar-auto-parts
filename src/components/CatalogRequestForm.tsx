"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const inputClass = "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";

export function CatalogRequestForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="incar-card rounded-lg p-5 md:p-7" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
          Qualified catalog request
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Request catalog material for your purchasing team
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Share your buyer profile and catalog interest so INCAR can review the
          request before follow-up through WhatsApp or email.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Full name
          <input className={inputClass} name="fullName" required />
        </label>
        <label className={labelClass}>
          Company name
          <input className={inputClass} name="companyName" required />
        </label>
        <label className={labelClass}>
          Country
          <input
            className={inputClass}
            name="country"
            defaultValue="Saudi Arabia"
          />
        </label>
        <label className={labelClass}>
          City
          <input
            className={inputClass}
            name="city"
            placeholder="Riyadh, Jeddah, Dammam"
          />
        </label>
        <label className={labelClass}>
          Email
          <input className={inputClass} name="email" type="email" required />
        </label>
        <label className={labelClass}>
          WhatsApp number
          <input className={inputClass} name="whatsapp" placeholder="+966" />
        </label>
        <label className={labelClass}>
          Catalog interest
          <select
            className={inputClass}
            name="catalogInterest"
            defaultValue="Toyota wholesale parts"
          >
            <option>Toyota wholesale parts</option>
            <option>Hyundai wholesale parts</option>
            <option>Private Label packaging</option>
            <option>Bulk RFQ preparation</option>
            <option>General sourcing catalog</option>
          </select>
        </label>
        <label className={labelClass}>
          Brand
          <select className={inputClass} name="brand" defaultValue="Toyota">
            <option>Toyota</option>
            <option>Hyundai</option>
            <option>Private Label</option>
            <option>Multiple brands</option>
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Vehicle model or category
          <input
            className={inputClass}
            name="vehicleModelOrCategory"
            placeholder="Camry, Corolla, Tucson, brake parts, filters"
          />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Message
          <textarea
            className="incar-input min-h-32 px-4 py-3 text-sm"
            name="message"
            placeholder="Share part numbers, OEM numbers, MOQ interest, or packaging requirements."
          />
        </label>
      </div>

      {submitted ? (
        <div className="mt-6 rounded-md border border-metallic-silver/24 bg-background p-4 text-sm leading-6 text-metallic-silver">
          Your catalog request has been received. Our team will review your
          interest and contact you through WhatsApp or email.
        </div>
      ) : null}

      <button
        type="submit"
        className="incar-focus mt-6 min-h-12 w-full rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover md:w-auto"
      >
        Request Catalog
      </button>
    </form>
  );
}
