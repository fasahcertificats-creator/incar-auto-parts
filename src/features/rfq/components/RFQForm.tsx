"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { RFQFormData } from "@/types/rfq";
import type { UploadedRFQFileMeta } from "@/types/upload";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { useRFQ } from "../use-rfq";
import { RFQExcelUpload } from "./RFQExcelUpload";

const inputClass = "incar-input px-4 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function RFQForm() {
  const { items, submitRFQ, submission } = useRFQ();
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const [excelFile, setExcelFile] = useState<UploadedRFQFileMeta | null>(null);
  const [excelFileError, setExcelFileError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const defaultInterestedProducts = useMemo(
    () => items.map((item) => item.partNumber).join(", "),
    [items],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const formValues: RFQFormData = {
      fullName: getText(data, "fullName"),
      companyName: getText(data, "companyName"),
      country: getText(data, "country"),
      city: getText(data, "city"),
      email: getText(data, "email"),
      whatsapp: getText(data, "whatsapp"),
      interestedProductsText: getText(data, "interestedProductsText"),
      requestedQuantityText: getText(data, "requestedQuantityText"),
      message: getText(data, "message"),
      excelFile,
    };
    const nextErrors: string[] = [];

    if (!formValues.fullName) nextErrors.push(dictionary.forms.rfq.errors.fullName);
    if (!formValues.companyName) nextErrors.push(dictionary.forms.rfq.errors.companyName);
    if (!formValues.email && !formValues.whatsapp) {
      nextErrors.push(dictionary.forms.rfq.errors.contact);
    }
    if (
      items.length === 0 &&
      !formValues.interestedProductsText &&
      !formValues.excelFile
    ) {
      nextErrors.push(dictionary.forms.rfq.errors.products);
    }
    if (excelFileError) nextErrors.push(excelFileError);
    const requestedQuantity = Number(formValues.requestedQuantityText);
    if (
      formValues.requestedQuantityText &&
      (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0)
    ) {
      nextErrors.push(dictionary.forms.rfq.errors.quantity);
    }

    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    submitRFQ(formValues);
  }

  return (
    <form className="incar-card rounded-lg p-5 md:p-7" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
          {dictionary.forms.rfq.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {dictionary.forms.rfq.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          {dictionary.forms.rfq.description}
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
          <input className={inputClass} name="country" defaultValue={dictionary.forms.common.countryDefault} />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.city}
          <input className={inputClass} name="city" placeholder={dictionary.forms.common.cityPlaceholder} />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.email}
          <input className={inputClass} type="email" name="email" />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.whatsapp}
          <input className={inputClass} name="whatsapp" placeholder="+966" />
        </label>
        <label className={labelClass}>
          {dictionary.forms.rfq.products}
          <input
            className={inputClass}
            name="interestedProductsText"
            defaultValue={defaultInterestedProducts}
            placeholder={dictionary.forms.rfq.productsPlaceholder}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.rfq.quantity}
          <input
            className={inputClass}
            name="requestedQuantityText"
            placeholder={dictionary.forms.rfq.quantityPlaceholder}
          />
        </label>
        <RFQExcelUpload
          value={excelFile}
          error={excelFileError}
          onChange={setExcelFile}
          onErrorChange={setExcelFileError}
        />
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.common.message}
          <textarea
            className="incar-input min-h-32 px-4 py-3 text-sm"
            name="message"
            placeholder={dictionary.forms.rfq.messagePlaceholder}
          />
        </label>
      </div>

      {errors.length > 0 ? (
        <div className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm leading-6 text-white">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      {submission ? (
        <div className="mt-6 rounded-md border border-metallic-silver/24 bg-background p-4 text-sm leading-6 text-metallic-silver">
          {submission.excelFile
            ? dictionary.forms.rfq.receivedWithFile
            : dictionary.forms.rfq.received}
        </div>
      ) : null}

      <button
        type="submit"
        className="incar-focus mt-6 min-h-12 w-full rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover md:w-auto"
      >
        {dictionary.forms.rfq.submit}
      </button>
    </form>
  );
}
