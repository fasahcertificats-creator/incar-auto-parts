"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { AdminApiError, adminGetMake, adminUpdateMake } from "@/features/admin/api/client";
import { ADMIN_CATALOG_PUBLISHING_STATUSES, type AdminMake } from "@/features/admin/api/contracts";

type DetailState =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error"; message: string }
  | { kind: "ready"; make: AdminMake };

export default function AdminMakeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [state, setState] = useState<DetailState>({ kind: "loading" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminGetMake(id)
      .then((make) => !cancelled && setState({ kind: "ready", make }))
      .catch((caught: unknown) => {
        if (cancelled) return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (caught instanceof AdminApiError && caught.status === 404) {
          setState({ kind: "not-found" });
          return;
        }
        setState({
          kind: "error",
          message: caught instanceof AdminApiError ? caught.message : "Failed to load make.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    const data = new FormData(event.currentTarget);
    try {
      const updated = await adminUpdateMake(id, {
        slug: String(data.get("slug") ?? ""),
        nameAr: String(data.get("nameAr") ?? ""),
        nameEn: String(data.get("nameEn") ?? ""),
        descriptionAr: String(data.get("descriptionAr") ?? "").trim() || null,
        descriptionEn: String(data.get("descriptionEn") ?? "").trim() || null,
        status: String(data.get("status") ?? "draft"),
      });
      setState({ kind: "ready", make: updated });
    } catch (caught) {
      setSaveError(caught instanceof AdminApiError ? caught.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (state.kind === "loading") return <p className="text-sm text-muted">Loading…</p>;
  if (state.kind === "not-found") return <p className="text-sm text-muted">Make not found.</p>;
  if (state.kind === "error") {
    return (
      <p className="rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
        {state.message}
      </p>
    );
  }

  const make = state.make;

  return (
    <div>
      <Link href="/admin/vehicles" className="incar-focus text-sm text-metallic-silver hover:text-white">
        ← Back to vehicles
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-white">{make.nameEn}</h1>
      <p className="mt-1 text-sm text-muted">{make.modelCount} models.</p>

      <form onSubmit={handleSave} className="incar-card mt-6 grid gap-4 rounded-lg p-6 sm:max-w-2xl sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-white">
          Slug
          <input name="slug" defaultValue={make.slug} required className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Status
          <select name="status" defaultValue={make.status} className="incar-input px-4 text-sm">
            {ADMIN_CATALOG_PUBLISHING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Name (Arabic)
          <input name="nameAr" dir="rtl" defaultValue={make.nameAr} required className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Name (English)
          <input name="nameEn" defaultValue={make.nameEn} required className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">
          Description (Arabic)
          <textarea name="descriptionAr" dir="rtl" defaultValue={make.descriptionAr ?? ""} rows={3} className="incar-input px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">
          Description (English)
          <textarea name="descriptionEn" defaultValue={make.descriptionEn ?? ""} rows={3} className="incar-input px-4 py-3 text-sm" />
        </label>
        {saveError ? (
          <p className="sm:col-span-2 rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
            {saveError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="incar-focus min-h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
