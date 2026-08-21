"use client";

import type { FormEvent } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { useInquirySubmission } from "@/features/inquiries/hooks/useInquirySubmission";
import type { CatalogRequestInquiryPayload } from "@/features/inquiries/api/contracts";

const inputClass = "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";

export function CatalogRequestForm() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const { state, errorMessage, retryBlocked, response, submit } = useInquirySubmission();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (retryBlocked || state === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const getText = (field: string) => String(data.get(field) ?? "").trim();

    const payload: CatalogRequestInquiryPayload = {
      type: "catalog-request",
      fullName: getText("fullName"),
      companyName: getText("companyName"),
      country: getText("country") || undefined,
      city: getText("city") || undefined,
      email: getText("email"),
      whatsapp: getText("whatsapp") || undefined,
      catalogInterest: getText("catalogInterest") || dictionary.forms.catalog.options[0],
      brand: getText("brand") || dictionary.forms.catalog.brandOptions[0],
      vehicleModelOrCategory: getText("vehicleModelOrCategory") || undefined,
      message: getText("message") || undefined,
      locale,
    };

    const succeeded = await submit(payload);
    if (succeeded) form.reset();
  }

  return (
    <form className="incar-card rounded-lg p-5 md:p-7" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
          {dictionary.forms.catalog.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {dictionary.forms.catalog.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          {dictionary.forms.catalog.description}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {dictionary.forms.common.fullName}
          <input className={inputClass} name="fullName" required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.companyName}
          <input className={inputClass} name="companyName" required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.country}
          <input
            className={inputClass}
            name="country"
            defaultValue={dictionary.forms.common.countryDefault}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.city}
          <input
            className={inputClass}
            name="city"
            placeholder={dictionary.forms.common.cityPlaceholder}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.email}
          <input className={inputClass} name="email" type="email" required />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.whatsapp}
          <input className={inputClass} name="whatsapp" placeholder="+966" />
        </label>
        <label className={labelClass}>
          {dictionary.forms.catalog.catalogInterest}
          <select
            className={inputClass}
            name="catalogInterest"
            defaultValue={dictionary.forms.catalog.options[0]}
          >
            {dictionary.forms.catalog.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {dictionary.forms.catalog.brand}
          <select className={inputClass} name="brand" defaultValue={dictionary.forms.catalog.brandOptions[0]}>
            {dictionary.forms.catalog.brandOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.catalog.vehicleModelOrCategory}
          <input
            className={inputClass}
            name="vehicleModelOrCategory"
            placeholder="Camry, Corolla, Tucson, brake parts, filters"
          />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.common.message}
          <textarea
            className="incar-input min-h-32 px-4 py-3 text-sm"
            name="message"
            placeholder={dictionary.forms.catalog.messagePlaceholder}
          />
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
          <p>{dictionary.forms.catalog.received}</p>
          <p className="mt-2 font-semibold text-white">
            {dictionary.forms.common.reference}: {response.publicReference}
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting" || retryBlocked}
        aria-busy={state === "submitting"}
        className="incar-focus mt-6 min-h-12 w-full rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {state === "submitting" ? dictionary.forms.common.submitting : dictionary.forms.catalog.submit}
      </button>
    </form>
  );
}
