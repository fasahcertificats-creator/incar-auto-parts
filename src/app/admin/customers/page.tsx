"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminApiError, adminListCustomers } from "@/features/admin/api/client";
import {
  ADMIN_CUSTOMER_BUSINESS_TYPES,
  type AdminCustomerListResponse,
} from "@/features/admin/api/contracts";
import { AdminPagination } from "@/features/admin/components/AdminPagination";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

type ListState =
  | { kind: "loading" }
  | { kind: "ready"; page: AdminCustomerListResponse }
  | { kind: "error"; message: string };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [offset, setOffset] = useState(0);
  const [state, setState] = useState<ListState>({ kind: "loading" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setOffset(0);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    adminListCustomers(PAGE_SIZE, offset, search || undefined, category || undefined)
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
          message: caught instanceof AdminApiError ? caught.message : "Failed to load customers.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [offset, search, category, router]);

  const page = state.kind === "ready" ? state.page : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Customers</h1>
      <p className="mt-2 text-sm text-muted">
        One record per person, auto-linked from their RFQ and inquiry submissions by email.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by company, contact, or email"
          className="incar-input min-h-11 w-full px-4 text-sm sm:max-w-sm"
        />
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setOffset(0);
          }}
          className="incar-input min-h-11 px-4 text-sm sm:w-56"
        >
          <option value="">All categories</option>
          {ADMIN_CUSTOMER_BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {state.kind === "error" ? (
        <p className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          {state.message}
        </p>
      ) : null}

      {state.kind === "loading" ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}

      {page && page.items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No customers match.</p>
      ) : null}

      {page && page.items.length > 0 ? (
        <div className="incar-card mt-6 overflow-x-auto rounded-lg">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Requests</th>
                <th className="px-4 py-3">First contact</th>
              </tr>
            </thead>
            <tbody>
              {page.items.map((item) => (
                <tr key={item.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${item.id}`}
                      className="incar-focus rounded-sm font-semibold text-white hover:text-metallic-silver"
                    >
                      {item.contactName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-metallic-silver">{item.companyName}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.email}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.businessType ?? "—"}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.requestCount}</td>
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
          itemLabel="customers"
          onOffsetChange={setOffset}
        />
      ) : null}
    </div>
  );
}
