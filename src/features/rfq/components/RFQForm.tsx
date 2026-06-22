"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { RFQFormData } from "@/types/rfq";
import type { UploadedRFQFileMeta } from "@/types/upload";
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

    if (!formValues.fullName) nextErrors.push("Full name is required.");
    if (!formValues.companyName) nextErrors.push("Company name is required.");
    if (!formValues.email && !formValues.whatsapp) {
      nextErrors.push("Email or WhatsApp number is required.");
    }
    if (
      items.length === 0 &&
      !formValues.interestedProductsText &&
      !formValues.excelFile
    ) {
      nextErrors.push(
        "Please add products to RFQ, enter part numbers, or upload an Excel/CSV file.",
      );
    }
    if (excelFileError) nextErrors.push(excelFileError);
    const requestedQuantity = Number(formValues.requestedQuantityText);
    if (
      formValues.requestedQuantityText &&
      (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0)
    ) {
      nextErrors.push("Quantity must be positive if provided.");
    }

    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    submitRFQ(formValues);
  }

  return (
    <form className="incar-card rounded-lg p-5 md:p-7" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
          Wholesale Inquiry
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Submit RFQ details
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Upload an Excel or CSV file, select products from the RFQ list, or
          enter part numbers manually. File processing is not connected yet; the
          mock RFQ submission captures metadata only.
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
          <input className={inputClass} name="country" defaultValue="Saudi Arabia" />
        </label>
        <label className={labelClass}>
          City
          <input className={inputClass} name="city" placeholder="Riyadh, Jeddah, Dammam" />
        </label>
        <label className={labelClass}>
          Email
          <input className={inputClass} type="email" name="email" />
        </label>
        <label className={labelClass}>
          WhatsApp number
          <input className={inputClass} name="whatsapp" placeholder="+966" />
        </label>
        <label className={labelClass}>
          Interested products / part numbers
          <input
            className={inputClass}
            name="interestedProductsText"
            defaultValue={defaultInterestedProducts}
            placeholder="Part numbers, OEM numbers, or categories"
          />
        </label>
        <label className={labelClass}>
          Quantity
          <input
            className={inputClass}
            name="requestedQuantityText"
            placeholder="Estimated total quantity"
          />
        </label>
        <RFQExcelUpload
          value={excelFile}
          error={excelFileError}
          onChange={setExcelFile}
          onErrorChange={setExcelFileError}
        />
        <label className={`${labelClass} md:col-span-2`}>
          Message
          <textarea
            className="incar-input min-h-32 px-4 py-3 text-sm"
            name="message"
            placeholder="Share OEM numbers, target quality, packaging preference, and destination port."
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
            ? "Your RFQ has been prepared with the selected file. Our sourcing team will review your request and contact you through WhatsApp or email."
            : "Your RFQ has been received. Our sourcing team will review your request and contact you through WhatsApp or email."}
        </div>
      ) : null}

      <button
        type="submit"
        className="incar-focus mt-6 min-h-12 w-full rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.24)] transition hover:bg-primary-hover md:w-auto"
      >
        Submit RFQ
      </button>
    </form>
  );
}
