"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminApiError, adminListCategories, adminListProducts } from "@/features/admin/api/client";
import {
  ADMIN_CATALOG_PUBLISHING_STATUSES,
  type AdminCategory,
  type AdminProductListResponse,
} from "@/features/admin/api/contracts";
import { AdminPagination } from "@/features/admin/components/AdminPagination";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

type ListState =
  | { kind: "loading" }
  | { kind: "ready"; page: AdminProductListResponse }
  | { kind: "error"; message: string };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const [state, setState] = useState<ListState>({ kind: "loading" });

  useEffect(() => {
    adminListCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setOffset(0);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    adminListProducts(PAGE_SIZE, offset, search || undefined, categoryId || undefined, status || undefined)
      .then((page) => {
        if (!cancelled) setState({ kind: "ready", page });
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          router.push("/admin/login");
          return;
        }
        setState({
          kind: "error",
          message: caught instanceof AdminApiError ? caught.message : "Failed to load products.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [offset, search, categoryId, status, router]);

  const page = state.kind === "ready" ? state.page : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="mt-2 text-sm text-muted">The real product catalog, replacing sample data.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/import"
            className="incar-focus min-h-10 inline-flex items-center rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
          >
            Bulk import
          </Link>
          <Link
            href="/admin/products/new"
            className="incar-focus min-h-10 inline-flex items-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Add product
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by part number or name"
          className="incar-input min-h-11 w-full px-4 text-sm sm:max-w-sm"
        />
        <select
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
            setOffset(0);
          }}
          className="incar-input min-h-11 px-4 text-sm sm:w-56"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.nameEn}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setOffset(0);
          }}
          className="incar-input min-h-11 px-4 text-sm sm:w-44"
        >
          <option value="">All statuses</option>
          {ADMIN_CATALOG_PUBLISHING_STATUSES.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {state.kind === "error" ? (
        <p className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          {state.message}
        </p>
      ) : null}
      {state.kind === "loading" ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}
      {page && page.items.length === 0 ? <p className="mt-6 text-sm text-muted">No products match.</p> : null}

      {page && page.items.length > 0 ? (
        <div className="incar-card mt-6 overflow-x-auto rounded-lg">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3" />
                <th className="px-4 py-3">Part number</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Instant purchase</th>
                <th className="px-4 py-3">Added</th>
              </tr>
            </thead>
            <tbody>
              {page.items.map((item) => (
                <tr key={item.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="size-10 overflow-hidden rounded-md border border-border bg-surface-elevated">
                      {item.primaryImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin list thumbnail
                        <img src={item.primaryImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${item.id}`}
                      className="incar-focus rounded-sm font-semibold text-white hover:text-metallic-silver"
                    >
                      {item.partNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-metallic-silver">{item.nameEn}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.categoryNameEn}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.status}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.dataVerificationState}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.availableForInstantPurchase ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {page ? (
        <AdminPagination
          total={page.total}
          itemCount={page.items.length}
          offset={offset}
          pageSize={PAGE_SIZE}
          itemLabel="products"
          onOffsetChange={setOffset}
        />
      ) : null}
    </div>
  );
}
