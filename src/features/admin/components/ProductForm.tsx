"use client";

import { type FormEvent, useEffect, useState } from "react";
import { adminListMakes, adminListModels } from "@/features/admin/api/client";
import {
  ADMIN_CATALOG_PUBLISHING_STATUSES,
  ADMIN_COMPATIBILITY_STATUSES,
  ADMIN_DATA_VERIFICATION_STATES,
  ADMIN_REQUEST_ELIGIBILITY_VALUES,
  type AdminCategory,
  type AdminMake,
  type AdminModel,
  type AdminProductDetail,
  type AdminProductInput,
  type AdminProductVehicleRelationship,
} from "@/features/admin/api/contracts";
import { isValidSlug, slugify, SLUG_FORMAT_HINT } from "@/features/admin/lib/slug";

type RelationshipDraft = AdminProductVehicleRelationship & { key: string };
type SpecDraft = { key: string; ar: string; en: string; draftKey: string };

function toRelationshipDrafts(relationships: AdminProductVehicleRelationship[]): RelationshipDraft[] {
  return relationships.map((relationship, index) => ({
    ...relationship,
    key: `${relationship.makeId}-${relationship.modelId}-${index}`,
  }));
}

function toSpecDrafts(specifications: AdminProductDetail["specifications"]): SpecDraft[] {
  if (!specifications) return [];
  return Object.entries(specifications).map(([key, value], index) => ({
    key,
    ar: value.ar ?? "",
    en: value.en ?? "",
    draftKey: `${key}-${index}`,
  }));
}

function ReferenceListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-semibold text-white">{label}</p>
      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={value}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="incar-input min-h-10 flex-1 px-3 text-sm"
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
            className="incar-focus rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="incar-focus w-fit rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-metallic-silver hover:text-white"
      >
        + Add
      </button>
    </div>
  );
}

export function ProductForm({
  initial,
  categories,
  submitLabel,
  onSubmit,
}: {
  initial?: AdminProductDetail;
  categories: AdminCategory[];
  submitLabel: string;
  onSubmit: (input: AdminProductInput) => Promise<void>;
}) {
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const slugInvalid = slugTouched && slug.length > 0 && !isValidSlug(slug);
  const [partNumber, setPartNumber] = useState(initial?.partNumber ?? "");
  const [nameAr, setNameAr] = useState(initial?.nameAr ?? "");
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? "");
  const [descriptionAr, setDescriptionAr] = useState(initial?.descriptionAr ?? "");
  const [descriptionEn, setDescriptionEn] = useState(initial?.descriptionEn ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [oemReferences, setOemReferences] = useState(initial?.oemReferences ?? []);
  const [verifiedAlternateReferences, setVerifiedAlternateReferences] = useState(
    initial?.verifiedAlternateReferences ?? [],
  );
  const [compatibilityStatus, setCompatibilityStatus] = useState(
    initial?.compatibilityStatus ?? "not-verified",
  );
  const [requestEligibility, setRequestEligibility] = useState(
    initial?.requestEligibility ?? "verification-required",
  );
  const [requestEligibilityNotes, setRequestEligibilityNotes] = useState(
    initial?.requestEligibilityNotes ?? "",
  );
  const [dataVerificationState, setDataVerificationState] = useState(
    initial?.dataVerificationState ?? "unverified",
  );
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [referencePriceUsd, setReferencePriceUsd] = useState(initial?.referencePriceUsd ?? "");
  const [referencePriceCny, setReferencePriceCny] = useState(initial?.referencePriceCny ?? "");
  const [directSalePriceUsd, setDirectSalePriceUsd] = useState(initial?.directSalePriceUsd ?? "");
  const [directSalePriceCny, setDirectSalePriceCny] = useState(initial?.directSalePriceCny ?? "");
  const [availableForInstantPurchase, setAvailableForInstantPurchase] = useState(
    initial?.availableForInstantPurchase ?? false,
  );
  const [relationships, setRelationships] = useState<RelationshipDraft[]>(
    toRelationshipDrafts(initial?.vehicleRelationships ?? []),
  );
  const [specs, setSpecs] = useState<SpecDraft[]>(toSpecDrafts(initial?.specifications ?? null));

  const [makes, setMakes] = useState<AdminMake[]>([]);
  const [modelsByMake, setModelsByMake] = useState<Record<string, AdminModel[]>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminListMakes()
      .then(setMakes)
      .catch(() => setMakes([]));
  }, []);

  function ensureModelsLoaded(makeId: string) {
    if (!makeId || modelsByMake[makeId]) return;
    adminListModels(makeId)
      .then((models) => setModelsByMake((current) => ({ ...current, [makeId]: models })))
      .catch(() => undefined);
  }

  useEffect(() => {
    relationships.forEach((relationship) => ensureModelsLoaded(relationship.makeId));
    // Loading models for whichever makes are already selected on mount/initial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateRelationship(key: string, patch: Partial<RelationshipDraft>) {
    setRelationships((current) =>
      current.map((relationship) => (relationship.key === key ? { ...relationship, ...patch } : relationship)),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidSlug(slug)) {
      setSlugTouched(true);
      setError(SLUG_FORMAT_HINT);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        slug,
        partNumber,
        oemReferences: oemReferences.map((value) => value.trim()).filter(Boolean),
        verifiedAlternateReferences: verifiedAlternateReferences.map((value) => value.trim()).filter(Boolean),
        nameAr,
        nameEn,
        descriptionAr: descriptionAr.trim() || null,
        descriptionEn: descriptionEn.trim() || null,
        categoryId,
        specifications: specs.length
          ? Object.fromEntries(
              specs
                .filter((spec) => spec.key.trim())
                .map((spec) => [spec.key.trim(), { ar: spec.ar || undefined, en: spec.en || undefined }]),
            )
          : null,
        compatibilityStatus,
        requestEligibility,
        requestEligibilityNotes: requestEligibilityNotes.trim() || null,
        dataVerificationState,
        status,
        referencePriceUsd: referencePriceUsd === "" ? null : Number(referencePriceUsd),
        referencePriceCny: referencePriceCny === "" ? null : Number(referencePriceCny),
        directSalePriceUsd: directSalePriceUsd === "" ? null : Number(directSalePriceUsd),
        directSalePriceCny: directSalePriceCny === "" ? null : Number(directSalePriceCny),
        availableForInstantPurchase,
        vehicleRelationships: relationships
          .filter((relationship) => relationship.makeId && relationship.modelId)
          .map((relationship) => ({
            makeId: relationship.makeId,
            modelId: relationship.modelId,
            compatibilityStatus: relationship.compatibilityStatus,
            verifiedYearRanges: relationship.verifiedYearRanges,
          })),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="incar-card grid gap-4 rounded-lg p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold text-white sm:col-span-2">Identity</h2>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Slug
          <input
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugTouched(true);
            }}
            required
            aria-invalid={slugInvalid}
            className="incar-input px-4 text-sm"
          />
          <span className={`text-xs font-normal ${slugInvalid ? "text-primary" : "text-muted"}`}>
            {slugInvalid
              ? SLUG_FORMAT_HINT
              : initial
                ? "Used in the product's public URL."
                : "Auto-filled from the English name — edit if needed."}
          </span>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Part number
          <input value={partNumber} onChange={(event) => setPartNumber(event.target.value)} required className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Name (Arabic)
          <input dir="rtl" value={nameAr} onChange={(event) => setNameAr(event.target.value)} required className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Name (English)
          <input
            value={nameEn}
            onChange={(event) => {
              setNameEn(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            required
            className="incar-input px-4 text-sm"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">
          Description (Arabic)
          <textarea dir="rtl" value={descriptionAr} onChange={(event) => setDescriptionAr(event.target.value)} rows={3} className="incar-input px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">
          Description (English)
          <textarea value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} rows={3} className="incar-input px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Category
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required className="incar-input px-4 text-sm">
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.nameEn}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="incar-input px-4 text-sm">
            {ADMIN_CATALOG_PUBLISHING_STATUSES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <ReferenceListEditor label="OEM references" values={oemReferences} onChange={setOemReferences} />
        </div>
        <div className="sm:col-span-2">
          <ReferenceListEditor
            label="Verified alternate references"
            values={verifiedAlternateReferences}
            onChange={setVerifiedAlternateReferences}
          />
        </div>
      </div>

      <div className="incar-card grid gap-4 rounded-lg p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold text-white sm:col-span-2">Verification & eligibility</h2>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Compatibility status
          <select value={compatibilityStatus} onChange={(event) => setCompatibilityStatus(event.target.value)} className="incar-input px-4 text-sm">
            {ADMIN_COMPATIBILITY_STATUSES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Data verification state
          <select value={dataVerificationState} onChange={(event) => setDataVerificationState(event.target.value)} className="incar-input px-4 text-sm">
            {ADMIN_DATA_VERIFICATION_STATES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Request eligibility
          <select value={requestEligibility} onChange={(event) => setRequestEligibility(event.target.value)} className="incar-input px-4 text-sm">
            {ADMIN_REQUEST_ELIGIBILITY_VALUES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Request eligibility notes
          <input
            value={requestEligibilityNotes}
            onChange={(event) => setRequestEligibilityNotes(event.target.value)}
            placeholder="Required if published + not-currently-requestable"
            className="incar-input px-4 text-sm"
          />
        </label>
      </div>

      <div className="incar-card grid gap-4 rounded-lg p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold text-white sm:col-span-2">
          Pricing & storefront <span className="font-normal text-muted">(admin-only, never public)</span>
        </h2>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Reference price (USD)
          <input type="number" min={0} step={0.01} value={referencePriceUsd ?? ""} onChange={(event) => setReferencePriceUsd(event.target.value)} className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Reference price (CNY)
          <input type="number" min={0} step={0.01} value={referencePriceCny ?? ""} onChange={(event) => setReferencePriceCny(event.target.value)} className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Direct-sale price (USD)
          <input type="number" min={0} step={0.01} value={directSalePriceUsd ?? ""} onChange={(event) => setDirectSalePriceUsd(event.target.value)} className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Direct-sale price (CNY)
          <input type="number" min={0} step={0.01} value={directSalePriceCny ?? ""} onChange={(event) => setDirectSalePriceCny(event.target.value)} className="incar-input px-4 text-sm" />
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold text-white sm:col-span-2">
          <input
            type="checkbox"
            checked={availableForInstantPurchase}
            onChange={(event) => setAvailableForInstantPurchase(event.target.checked)}
            className="size-4"
          />
          Available for instant purchase (storefront, Phase 3b)
        </label>
      </div>

      <div className="incar-card grid gap-4 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Vehicle compatibility</h2>
          <button
            type="button"
            onClick={() =>
              setRelationships((current) => [
                ...current,
                {
                  key: `new-${current.length}-${Date.now()}`,
                  makeId: "",
                  modelId: "",
                  compatibilityStatus: "not-verified",
                  verifiedYearRanges: null,
                },
              ])
            }
            className="incar-focus rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-metallic-silver hover:text-white"
          >
            + Add relationship
          </button>
        </div>
        {relationships.length === 0 ? <p className="text-sm text-muted">No vehicle relationships yet.</p> : null}
        {relationships.map((relationship) => (
          <div key={relationship.key} className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-4">
            <select
              value={relationship.makeId}
              onChange={(event) => {
                updateRelationship(relationship.key, { makeId: event.target.value, modelId: "" });
                ensureModelsLoaded(event.target.value);
              }}
              className="incar-input px-3 text-sm"
            >
              <option value="">Select make</option>
              {makes.map((make) => (
                <option key={make.id} value={make.id}>{make.nameEn}</option>
              ))}
            </select>
            <select
              value={relationship.modelId}
              onChange={(event) => updateRelationship(relationship.key, { modelId: event.target.value })}
              disabled={!relationship.makeId}
              className="incar-input px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select model</option>
              {(modelsByMake[relationship.makeId] ?? []).map((model) => (
                <option key={model.id} value={model.id}>{model.nameEn}</option>
              ))}
            </select>
            <select
              value={relationship.compatibilityStatus}
              onChange={(event) => updateRelationship(relationship.key, { compatibilityStatus: event.target.value })}
              className="incar-input px-3 text-sm"
            >
              {ADMIN_COMPATIBILITY_STATUSES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setRelationships((current) => current.filter((item) => item.key !== relationship.key))}
              className="incar-focus rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="incar-card grid gap-4 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Specifications</h2>
          <button
            type="button"
            onClick={() => setSpecs((current) => [...current, { key: "", ar: "", en: "", draftKey: `new-${Date.now()}` }])}
            className="incar-focus rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-metallic-silver hover:text-white"
          >
            + Add specification
          </button>
        </div>
        {specs.map((spec) => (
          <div key={spec.draftKey} className="grid gap-3 sm:grid-cols-4">
            <input
              value={spec.key}
              onChange={(event) =>
                setSpecs((current) => current.map((item) => (item.draftKey === spec.draftKey ? { ...item, key: event.target.value } : item)))
              }
              placeholder="material"
              className="incar-input px-3 text-sm"
            />
            <input
              dir="rtl"
              value={spec.ar}
              onChange={(event) =>
                setSpecs((current) => current.map((item) => (item.draftKey === spec.draftKey ? { ...item, ar: event.target.value } : item)))
              }
              placeholder="القيمة بالعربية"
              className="incar-input px-3 text-sm"
            />
            <input
              value={spec.en}
              onChange={(event) =>
                setSpecs((current) => current.map((item) => (item.draftKey === spec.draftKey ? { ...item, en: event.target.value } : item)))
              }
              placeholder="English value"
              className="incar-input px-3 text-sm"
            />
            <button
              type="button"
              onClick={() => setSpecs((current) => current.filter((item) => item.draftKey !== spec.draftKey))}
              className="incar-focus rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {error ? (
        <p role="alert" className="rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="incar-focus min-h-11 w-fit rounded-md bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
