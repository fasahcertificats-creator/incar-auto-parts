"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  AdminApiError,
  adminCreateMake,
  adminCreateModel,
  adminListMakes,
  adminListModels,
} from "@/features/admin/api/client";
import {
  ADMIN_CATALOG_PUBLISHING_STATUSES,
  type AdminMake,
  type AdminModel,
} from "@/features/admin/api/contracts";
import { isValidSlug, slugify, SLUG_FORMAT_HINT } from "@/features/admin/lib/slug";

type MakesState =
  | { kind: "loading" }
  | { kind: "ready"; makes: AdminMake[] }
  | { kind: "error"; message: string };

type ModelsState =
  | { kind: "loading" }
  | { kind: "ready"; models: AdminModel[] }
  | { kind: "error"; message: string };

export default function AdminVehiclesPage() {
  const router = useRouter();
  const [makesState, setMakesState] = useState<MakesState>({ kind: "loading" });
  const [modelsState, setModelsState] = useState<ModelsState>({ kind: "loading" });
  const [selectedMakeId, setSelectedMakeId] = useState<string>("");
  const [makeFormOpen, setMakeFormOpen] = useState(false);
  const [modelFormOpen, setModelFormOpen] = useState(false);
  const [makeSaving, setMakeSaving] = useState(false);
  const [modelSaving, setModelSaving] = useState(false);
  const [makeError, setMakeError] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [makeSlug, setMakeSlug] = useState("");
  const [makeSlugTouched, setMakeSlugTouched] = useState(false);
  const makeSlugInvalid = makeSlugTouched && makeSlug.length > 0 && !isValidSlug(makeSlug);
  const [modelSlug, setModelSlug] = useState("");
  const [modelSlugTouched, setModelSlugTouched] = useState(false);
  const modelSlugInvalid = modelSlugTouched && modelSlug.length > 0 && !isValidSlug(modelSlug);

  function loadMakes() {
    adminListMakes()
      .then((makes) => {
        setMakesState({ kind: "ready", makes });
        setSelectedMakeId((current) => current || makes[0]?.id || "");
      })
      .catch((caught: unknown) => {
        if (caught instanceof AdminApiError && caught.status === 401) {
          router.push("/admin/login");
          return;
        }
        setMakesState({
          kind: "error",
          message: caught instanceof AdminApiError ? caught.message : "Failed to load makes.",
        });
      });
  }

  useEffect(loadMakes, [router]);

  useEffect(() => {
    if (!selectedMakeId) return;
    let cancelled = false;
    adminListModels(selectedMakeId)
      .then((models) => !cancelled && setModelsState({ kind: "ready", models }))
      .catch((caught: unknown) => {
        if (cancelled) return;
        setModelsState({
          kind: "error",
          message: caught instanceof AdminApiError ? caught.message : "Failed to load models.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [selectedMakeId]);

  async function handleCreateMake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidSlug(makeSlug)) {
      setMakeSlugTouched(true);
      setMakeError(SLUG_FORMAT_HINT);
      return;
    }
    setMakeSaving(true);
    setMakeError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await adminCreateMake({
        slug: makeSlug,
        nameAr: String(data.get("nameAr") ?? ""),
        nameEn: String(data.get("nameEn") ?? ""),
        descriptionAr: null,
        descriptionEn: null,
        status: String(data.get("status") ?? "draft"),
      });
      form.reset();
      setMakeSlug("");
      setMakeSlugTouched(false);
      setMakeFormOpen(false);
      loadMakes();
    } catch (caught) {
      setMakeError(caught instanceof AdminApiError ? caught.message : "Failed to create make.");
    } finally {
      setMakeSaving(false);
    }
  }

  async function handleCreateModel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMakeId) return;
    if (!isValidSlug(modelSlug)) {
      setModelSlugTouched(true);
      setModelError(SLUG_FORMAT_HINT);
      return;
    }
    setModelSaving(true);
    setModelError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const yearFrom = String(data.get("yearFrom") ?? "").trim();
    const yearTo = String(data.get("yearTo") ?? "").trim();
    try {
      await adminCreateModel({
        slug: modelSlug,
        makeId: selectedMakeId,
        nameAr: String(data.get("nameAr") ?? ""),
        nameEn: String(data.get("nameEn") ?? ""),
        descriptionAr: null,
        descriptionEn: null,
        status: String(data.get("status") ?? "draft"),
        verifiedYearRanges:
          yearFrom && yearTo ? [{ from: Number(yearFrom), to: Number(yearTo) }] : null,
      });
      form.reset();
      setModelSlug("");
      setModelSlugTouched(false);
      setModelFormOpen(false);
      const models = await adminListModels(selectedMakeId);
      setModelsState({ kind: "ready", models });
    } catch (caught) {
      setModelError(caught instanceof AdminApiError ? caught.message : "Failed to create model.");
    } finally {
      setModelSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Vehicles</h1>
      <p className="mt-2 text-sm text-muted">Makes and models used for product compatibility.</p>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Makes</h2>
          <button
            type="button"
            onClick={() => {
              setMakeFormOpen((open) => !open);
              setMakeSlug("");
              setMakeSlugTouched(false);
              setMakeError(null);
            }}
            className="incar-focus min-h-10 rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
          >
            {makeFormOpen ? "Cancel" : "Add make"}
          </button>
        </div>

        {makeFormOpen ? (
          <form onSubmit={handleCreateMake} className="incar-card mt-4 grid gap-4 rounded-lg p-6 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-white">
              Slug
              <input
                name="slug"
                required
                value={makeSlug}
                onChange={(event) => {
                  setMakeSlug(event.target.value);
                  setMakeSlugTouched(true);
                }}
                aria-invalid={makeSlugInvalid}
                className="incar-input px-4 text-sm"
                placeholder="toyota"
              />
              <span className={`text-xs font-normal ${makeSlugInvalid ? "text-primary" : "text-muted"}`}>
                {makeSlugInvalid ? SLUG_FORMAT_HINT : "Auto-filled from the English name — edit if needed."}
              </span>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white">
              Status
              <select name="status" defaultValue="draft" className="incar-input px-4 text-sm">
                {ADMIN_CATALOG_PUBLISHING_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white">
              Name (Arabic)
              <input name="nameAr" dir="rtl" required className="incar-input px-4 text-sm" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white">
              Name (English)
              <input
                name="nameEn"
                required
                className="incar-input px-4 text-sm"
                onChange={(event) => {
                  if (!makeSlugTouched) setMakeSlug(slugify(event.target.value));
                }}
              />
            </label>
            {makeError ? (
              <p className="sm:col-span-2 rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
                {makeError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={makeSaving}
              className="incar-focus min-h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            >
              {makeSaving ? "Creating…" : "Create make"}
            </button>
          </form>
        ) : null}

        {makesState.kind === "error" ? (
          <p className="mt-4 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
            {makesState.message}
          </p>
        ) : null}
        {makesState.kind === "loading" ? <p className="mt-4 text-sm text-muted">Loading…</p> : null}
        {makesState.kind === "ready" ? (
          <div className="incar-card mt-4 overflow-x-auto rounded-lg">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Models</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {makesState.makes.map((make) => (
                  <tr
                    key={make.id}
                    onClick={() => setSelectedMakeId(make.id)}
                    className={`cursor-pointer border-b border-border/60 last:border-0 ${selectedMakeId === make.id ? "bg-white/[0.04]" : ""}`}
                  >
                    <td className="px-4 py-3 font-semibold text-white">{make.nameEn}</td>
                    <td className="px-4 py-3 text-metallic-silver">{make.slug}</td>
                    <td className="px-4 py-3 text-metallic-silver">{make.status}</td>
                    <td className="px-4 py-3 text-metallic-silver">{make.modelCount}</td>
                    <td className="px-4 py-3 text-end">
                      <Link
                        href={`/admin/vehicles/makes/${make.id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="incar-focus rounded-sm text-sm font-semibold text-metallic-silver hover:text-white"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">
            Models
            {makesState.kind === "ready" && selectedMakeId ? (
              <span className="ml-2 text-sm font-normal text-muted">
                for {makesState.makes.find((make) => make.id === selectedMakeId)?.nameEn}
              </span>
            ) : null}
          </h2>
          <div className="flex items-center gap-3">
            {makesState.kind === "ready" ? (
              <select
                value={selectedMakeId}
                onChange={(event) => setSelectedMakeId(event.target.value)}
                className="incar-input min-h-10 px-3 text-sm"
              >
                {makesState.makes.map((make) => (
                  <option key={make.id} value={make.id}>
                    {make.nameEn}
                  </option>
                ))}
              </select>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setModelFormOpen((open) => !open);
                setModelSlug("");
                setModelSlugTouched(false);
                setModelError(null);
              }}
              disabled={!selectedMakeId}
              className="incar-focus min-h-10 rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {modelFormOpen ? "Cancel" : "Add model"}
            </button>
          </div>
        </div>

        {modelFormOpen ? (
          <form onSubmit={handleCreateModel} className="incar-card mt-4 grid gap-4 rounded-lg p-6 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-white">
              Slug
              <input
                name="slug"
                required
                value={modelSlug}
                onChange={(event) => {
                  setModelSlug(event.target.value);
                  setModelSlugTouched(true);
                }}
                aria-invalid={modelSlugInvalid}
                className="incar-input px-4 text-sm"
                placeholder="camry"
              />
              <span className={`text-xs font-normal ${modelSlugInvalid ? "text-primary" : "text-muted"}`}>
                {modelSlugInvalid ? SLUG_FORMAT_HINT : "Auto-filled from the English name — edit if needed."}
              </span>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white">
              Status
              <select name="status" defaultValue="draft" className="incar-input px-4 text-sm">
                {ADMIN_CATALOG_PUBLISHING_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white">
              Name (Arabic)
              <input name="nameAr" dir="rtl" required className="incar-input px-4 text-sm" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white">
              Name (English)
              <input
                name="nameEn"
                required
                className="incar-input px-4 text-sm"
                onChange={(event) => {
                  if (!modelSlugTouched) setModelSlug(slugify(event.target.value));
                }}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white">
              Verified year from
              <input name="yearFrom" type="number" min={1900} max={2200} className="incar-input px-4 text-sm" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white">
              Verified year to
              <input name="yearTo" type="number" min={1900} max={2200} className="incar-input px-4 text-sm" />
            </label>
            {modelError ? (
              <p className="sm:col-span-2 rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
                {modelError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={modelSaving}
              className="incar-focus min-h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            >
              {modelSaving ? "Creating…" : "Create model"}
            </button>
          </form>
        ) : null}

        {!selectedMakeId && makesState.kind === "ready" ? (
          <p className="mt-4 text-sm text-muted">Add a make first.</p>
        ) : null}
        {selectedMakeId && modelsState.kind === "error" ? (
          <p className="mt-4 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
            {modelsState.message}
          </p>
        ) : null}
        {selectedMakeId && modelsState.kind === "loading" ? (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        ) : null}
        {selectedMakeId && modelsState.kind === "ready" && modelsState.models.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No models for this make yet.</p>
        ) : null}
        {selectedMakeId && modelsState.kind === "ready" && modelsState.models.length > 0 ? (
          <div className="incar-card mt-4 overflow-x-auto rounded-lg">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Verified years</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {modelsState.models.map((model) => (
                  <tr key={model.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-white">{model.nameEn}</td>
                    <td className="px-4 py-3 text-metallic-silver">{model.slug}</td>
                    <td className="px-4 py-3 text-metallic-silver">{model.status}</td>
                    <td className="px-4 py-3 text-metallic-silver">
                      {model.verifiedYearRanges?.map((range) => `${range.from}–${range.to}`).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-metallic-silver">{model.productCount}</td>
                    <td className="px-4 py-3 text-end">
                      <Link
                        href={`/admin/vehicles/models/${model.id}`}
                        className="incar-focus rounded-sm text-sm font-semibold text-metallic-silver hover:text-white"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
