"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { privateLabelCategories } from "@/data/private-label";
import type {
  PrivateLabelCategory,
  PrivateLabelInquiry,
  PrivateLabelLogoStatus,
} from "@/types/private-label";

type PrivateLabelInquiryFormState = Omit<
  PrivateLabelInquiry,
  "createdAt" | "status"
>;

const initialFormState: PrivateLabelInquiryFormState = {
  fullName: "",
  companyName: "",
  country: "Saudi Arabia",
  city: "",
  email: "",
  whatsapp: "",
  brandName: "",
  productCategory: "Brake System",
  targetMarket: "Saudi Arabia",
  estimatedQuantity: "",
  logoStatus: "no",
  packagingRequirements: "",
  message: "",
};

const inputClass = "incar-input px-4 text-sm";
const textareaClass = "incar-input min-h-32 px-4 py-3 text-sm";
const labelClass = "grid gap-2 text-sm font-semibold text-white";

function isNumeric(value: string) {
  return value.trim() !== "" && !Number.isNaN(Number(value));
}

function validateForm(form: PrivateLabelInquiryFormState) {
  const errors: string[] = [];

  if (!form.fullName.trim()) errors.push("Full name is required.");
  if (!form.companyName.trim()) errors.push("Company name is required.");
  if (!form.email.trim() && !form.whatsapp.trim()) {
    errors.push("Email or WhatsApp number is required.");
  }
  if (!form.productCategory) errors.push("Product category is required.");
  if (!form.estimatedQuantity.trim()) {
    errors.push("Estimated quantity is required.");
  } else if (isNumeric(form.estimatedQuantity) && Number(form.estimatedQuantity) <= 0) {
    errors.push("Estimated quantity must be positive.");
  }
  if (!form.packagingRequirements.trim() && !form.message.trim()) {
    errors.push("Packaging requirements or message is required.");
  }

  return errors;
}

export function PrivateLabelInquiryForm() {
  const [form, setForm] = useState<PrivateLabelInquiryFormState>(initialFormState);
  const [errors, setErrors] = useState<string[]>([]);
  const [submittedInquiry, setSubmittedInquiry] =
    useState<PrivateLabelInquiry | null>(null);

  function updateField<Field extends keyof PrivateLabelInquiryFormState>(
    field: Field,
    value: PrivateLabelInquiryFormState[Field],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (nextErrors.length > 0) {
      setSubmittedInquiry(null);
      return;
    }

    // Future backend phases can persist this typed inquiry and attach logo or packaging mockup uploads.
    const inquiry: PrivateLabelInquiry = {
      ...form,
      createdAt: new Date().toISOString(),
      status: "submitted",
    };

    setSubmittedInquiry(inquiry);
  }

  return (
    <form
      className="incar-card rounded-lg p-5 md:p-7"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Full name
          <input
            className={inputClass}
            name="fullName"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Company name
          <input
            className={inputClass}
            name="companyName"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Country
          <input
            className={inputClass}
            name="country"
            value={form.country}
            onChange={(event) => updateField("country", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          City
          <input
            className={inputClass}
            name="city"
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Email
          <input
            className={inputClass}
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          WhatsApp number
          <input
            className={inputClass}
            name="whatsapp"
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Brand name
          <input
            className={inputClass}
            name="brandName"
            value={form.brandName}
            onChange={(event) => updateField("brandName", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Product category
          <select
            className={inputClass}
            name="productCategory"
            value={form.productCategory}
            onChange={(event) =>
              updateField(
                "productCategory",
                event.target.value as PrivateLabelCategory,
              )
            }
          >
            {privateLabelCategories.map((item) => (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Target market
          <input
            className={inputClass}
            name="targetMarket"
            value={form.targetMarket}
            onChange={(event) => updateField("targetMarket", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Estimated quantity
          <input
            className={inputClass}
            name="estimatedQuantity"
            value={form.estimatedQuantity}
            onChange={(event) =>
              updateField("estimatedQuantity", event.target.value)
            }
            placeholder="First order or monthly quantity"
          />
        </label>
        <label className={labelClass}>
          Do you already have a logo?
          <select
            className={inputClass}
            name="logoStatus"
            value={form.logoStatus}
            onChange={(event) =>
              updateField("logoStatus", event.target.value as PrivateLabelLogoStatus)
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="in_progress">In progress</option>
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Packaging requirements
          <textarea
            className={textareaClass}
            name="packagingRequirements"
            value={form.packagingRequirements}
            onChange={(event) =>
              updateField("packagingRequirements", event.target.value)
            }
            placeholder="Box design, logo placement, barcode, label language, carton marking, and market information."
          />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Message
          <textarea
            className={textareaClass}
            name="message"
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Share target products, quality grade, timing, or sourcing requirements."
          />
        </label>
      </div>

      {errors.length > 0 ? (
        <div className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm leading-6 text-soft-silver">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      {submittedInquiry ? (
        <div className="mt-6 rounded-md border border-metallic-silver/24 bg-background p-4 text-sm leading-6 text-metallic-silver">
          Your Private Label inquiry has been received. Our sourcing team will
          review your requirements and contact you through WhatsApp or email.
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
