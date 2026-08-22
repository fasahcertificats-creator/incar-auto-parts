"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  AdminApiError,
  adminCreateCategory,
  adminListCategories,
  adminReorderCategories,
} from "@/features/admin/api/client";
import {
  ADMIN_CATALOG_PUBLISHING_STATUSES,
  type AdminCategory,
} from "@/features/admin/api/contracts";

type ListState =
  | { kind: "loading" }
  | { kind: "ready"; categories: AdminCategory[] }
  | { kind: "error"; message: string };

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [state, setState] = useState<ListState>({ kind: "loading" });
  const [creating, setCreating] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [reordering, setReordering] = useState<string | null>(null);

  function load() {
    adminListCategories()
      .then((categories) => setState({ kind: "ready", categories }))
      .catch((caught: unknown) => {
        if (caught instanceof AdminApiError && caught.status === 401) {
          router.push("/admin/login");
          return;
        }
        setState({
          kind: "error",
          message: caught instanceof AdminApiError ? caught.message : "Failed to load categories.",
        });
      });
  }

  useEffect(load, [router]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setFormError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await adminCreateCategory({
        slug: String(data.get("slug") ?? ""),
        nameAr: String(data.get("nameAr") ?? ""),
        nameEn: String(data.get("nameEn") ?? ""),
        descriptionAr: null,
        descriptionEn: null,
        status: String(data.get("status") ?? "draft"),
      });
      form.reset();
      setFormOpen(false);
      load();
    } catch (caught) {
      setFormError(caught instanceof AdminApiError ? caught.message : "Failed to create category.");
    } finally {
      setCreating(false);
    }
  }

  async function move(categories: AdminCategory[], index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;
    const reordered = [...categories];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setReordering(categories[index].id);
    try {
      const updated = await adminReorderCategories(reordered.map((category) => category.id));
      setState({ kind: "ready", categories: updated });
    } catch (caught) {
      setState({
        kind: "error",
        message: caught instanceof AdminApiError ? caught.message : "Failed to reorder categories.",
      });
    } finally {
      setReordering(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <p className="mt-2 text-sm text-muted">
            Use the arrows to set the order shown across the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((open) => !open)}
          className="incar-focus min-h-10 rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
        >
          {formOpen ? "Cancel" : "Add category"}
        </button>
      </div>

      {formOpen ? (
        <form
          onSubmit={handleCreate}
          className="incar-card mt-4 grid gap-4 rounded-lg p-6 sm:grid-cols-2"
        >
          <label className="grid gap-2 text-sm font-semibold text-white">
            Slug
            <input name="slug" required className="incar-input px-4 text-sm" placeholder="brake-system" />
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
            <input name="nameEn" required className="incar-input px-4 text-sm" />
          </label>
          {formError ? (
            <p className="sm:col-span-2 rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
              {formError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={creating}
            className="incar-focus min-h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
          >
            {creating ? "Creating…" : "Create category"}
          </button>
        </form>
      ) : null}

      {state.kind === "error" ? (
        <p className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          {state.message}
        </p>
      ) : null}
      {state.kind === "loading" ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}

      {state.kind === "ready" && state.categories.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No categories yet.</p>
      ) : null}

      {state.kind === "ready" && state.categories.length > 0 ? (
        <div className="incar-card mt-6 overflow-x-auto rounded-lg">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {state.categories.map((category, index) => (
                <tr key={category.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => move(state.categories, index, -1)}
                        disabled={index === 0 || reordering !== null}
                        aria-label="Move up"
                        className="incar-focus inline-flex size-7 items-center justify-center rounded-md border border-border text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(state.categories, index, 1)}
                        disabled={index === state.categories.length - 1 || reordering !== null}
                        aria-label="Move down"
                        className="incar-focus inline-flex size-7 items-center justify-center rounded-md border border-border text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{category.nameEn}</td>
                  <td className="px-4 py-3 text-metallic-silver">{category.slug}</td>
                  <td className="px-4 py-3 text-metallic-silver">{category.status}</td>
                  <td className="px-4 py-3 text-metallic-silver">{category.productCount}</td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      href={`/admin/categories/${category.id}`}
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
    </div>
  );
}
