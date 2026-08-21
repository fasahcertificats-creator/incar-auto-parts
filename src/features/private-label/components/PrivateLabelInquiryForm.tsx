"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { privateLabelCategories } from "@/data/private-label";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import type {
  PrivateLabelCategory,
  PrivateLabelInquiry,
  PrivateLabelLogoStatus,
} from "@/types/private-label";
import { useInquirySubmission } from "@/features/inquiries/hooks/useInquirySubmission";
import type { PrivateLabelInquiryPayload } from "@/features/inquiries/api/contracts";

type PrivateLabelInquiryFormState = Omit<
  PrivateLabelInquiry,
  "createdAt" | "status"
>;

const initialFormState: PrivateLabelInquiryFormState = {
  fullName: "",
  companyName: "",
  country: "",
  city: "",
  email: "",
  whatsapp: "",
  brandName: "",
  productCategory: "Brake System",
  targetMarket: "Middle Eastern markets",
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

function validateForm(
  form: PrivateLabelInquiryFormState,
  dictionary: ReturnType<typeof getDictionary>,
) {
  const errors: string[] = [];

  if (!form.fullName.trim()) errors.push(dictionary.forms.privateLabel.errors.fullName);
  if (!form.companyName.trim()) {
    errors.push(dictionary.forms.privateLabel.errors.companyName);
  }
  if (!form.email.trim() && !form.whatsapp.trim()) {
    errors.push(dictionary.forms.privateLabel.errors.contact);
  }
  if (!form.productCategory) {
    errors.push(dictionary.forms.privateLabel.errors.productCategory);
  }
  if (!form.estimatedQuantity.trim()) {
    errors.push(dictionary.forms.privateLabel.errors.estimatedQuantity);
  } else if (isNumeric(form.estimatedQuantity) && Number(form.estimatedQuantity) <= 0) {
    errors.push(dictionary.forms.privateLabel.errors.estimatedQuantityPositive);
  }
  if (!form.packagingRequirements.trim() && !form.message.trim()) {
    errors.push(dictionary.forms.privateLabel.errors.packaging);
  }

  return errors;
}

export function PrivateLabelInquiryForm() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const [form, setForm] = useState<PrivateLabelInquiryFormState>(() => ({
    ...initialFormState,
    country: dictionary.forms.common.countryDefault,
    targetMarket: dictionary.brand.market,
  }));
  const [errors, setErrors] = useState<string[]>([]);
  const [submittedInquiry, setSubmittedInquiry] =
    useState<PrivateLabelInquiry | null>(null);
  const { state, errorMessage, retryBlocked, response, submit } = useInquirySubmission();

  function updateField<Field extends keyof PrivateLabelInquiryFormState>(
    field: Field,
    value: PrivateLabelInquiryFormState[Field],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (retryBlocked || state === "submitting") return;

    const nextErrors = validateForm(form, dictionary);
    setErrors(nextErrors);

    if (nextErrors.length > 0) {
      setSubmittedInquiry(null);
      return;
    }

    const payload: PrivateLabelInquiryPayload = {
      type: "private-label",
      fullName: form.fullName.trim(),
      companyName: form.companyName.trim(),
      country: form.country.trim(),
      city: form.city.trim(),
      email: form.email.trim() || undefined,
      whatsapp: form.whatsapp.trim() || undefined,
      brandName: form.brandName.trim(),
      productCategory: form.productCategory,
      targetMarket: form.targetMarket.trim(),
      estimatedQuantity: form.estimatedQuantity.trim(),
      logoStatus: form.logoStatus,
      packagingRequirements: form.packagingRequirements.trim() || undefined,
      message: form.message.trim() || undefined,
      locale,
    };

    const succeeded = await submit(payload);
    if (!succeeded) return;

    // Local echo of the submitted inquiry for on-page review; the
    // authoritative record now lives server-side under `response.publicReference`.
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
          {dictionary.forms.privateLabel.fullName}
          <input
            className={inputClass}
            name="fullName"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.privateLabel.companyName}
          <input
            className={inputClass}
            name="companyName"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.country}
          <input
            className={inputClass}
            name="country"
            value={form.country}
            onChange={(event) => updateField("country", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.city}
          <input
            className={inputClass}
            name="city"
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.email}
          <input
            className={inputClass}
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.common.whatsapp}
          <input
            className={inputClass}
            name="whatsapp"
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.privateLabel.brandName}
          <input
            className={inputClass}
            name="brandName"
            value={form.brandName}
            onChange={(event) => updateField("brandName", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.privateLabel.productCategory}
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
                {dictionary.categories[item.category]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {dictionary.forms.privateLabel.targetMarket}
          <input
            className={inputClass}
            name="targetMarket"
            value={form.targetMarket}
            onChange={(event) => updateField("targetMarket", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.privateLabel.estimatedQuantity}
          <input
            className={inputClass}
            name="estimatedQuantity"
            value={form.estimatedQuantity}
            onChange={(event) =>
              updateField("estimatedQuantity", event.target.value)
            }
            placeholder={dictionary.forms.privateLabel.quantityPlaceholder}
          />
        </label>
        <label className={labelClass}>
          {dictionary.forms.privateLabel.logoStatus}
          <select
            className={inputClass}
            name="logoStatus"
            value={form.logoStatus}
            onChange={(event) =>
              updateField("logoStatus", event.target.value as PrivateLabelLogoStatus)
            }
          >
            <option value="yes">{dictionary.forms.privateLabel.logoYes}</option>
            <option value="no">{dictionary.forms.privateLabel.logoNo}</option>
            <option value="in_progress">{dictionary.forms.privateLabel.logoProgress}</option>
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.privateLabel.packagingRequirements}
          <textarea
            className={textareaClass}
            name="packagingRequirements"
            value={form.packagingRequirements}
            onChange={(event) =>
              updateField("packagingRequirements", event.target.value)
            }
            placeholder={dictionary.forms.privateLabel.packagingPlaceholder}
          />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {dictionary.forms.common.message}
          <textarea
            className={textareaClass}
            name="message"
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder={dictionary.forms.privateLabel.messagePlaceholder}
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

      {errorMessage ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm leading-6 text-soft-silver"
        >
          {errorMessage}
        </div>
      ) : null}

      {submittedInquiry && response ? (
        <div className="mt-6 rounded-md border border-metallic-silver/24 bg-background p-4 text-sm leading-6 text-metallic-silver">
          <p>{dictionary.forms.privateLabel.received}</p>
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
        {state === "submitting" ? dictionary.forms.common.submitting : dictionary.forms.privateLabel.submit}
      </button>
    </form>
  );
}
