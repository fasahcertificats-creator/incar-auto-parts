"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminApiError, adminListQuotes } from "@/features/admin/api/client";
import { ADMIN_QUOTE_STATUSES, type AdminQuoteListResponse } from "@/features/admin/api/contracts";
import { AdminPagination } from "@/features/admin/components/AdminPagination";

const PAGE_SIZE = 20;

type ListState =
  | { kind: "loading" }
  | { kind: "ready"; page: AdminQuoteListResponse }
  | { kind: "error"; message: string };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminQuotesPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const [state, setState] = useState<ListState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    adminListQuotes(PAGE_SIZE, offset, undefined, undefined, status || undefined)
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
          message: caught instanceof AdminApiError ? caught.message : "Failed to load quotes.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [offset, status, router]);

  const page = state.kind === "ready" ? state.page : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Quotes</h1>
          <p className="mt-2 text-sm text-muted">
            Priced responses to RFQ requests — start one from a request&apos;s detail page.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setOffset(0);
          }}
          className="incar-input min-h-11 px-4 text-sm sm:w-44"
        >
          <option value="">All statuses</option>
          {ADMIN_QUOTE_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
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
      {page && page.items.length === 0 ? <p className="mt-6 text-sm text-muted">No quotes match.</p> : null}

      {page && page.items.length > 0 ? (
        <div className="incar-card mt-6 overflow-x-auto rounded-lg">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Currency</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {page.items.map((item) => (
                <tr key={item.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/quotes/${item.id}`}
                      dir="ltr"
                      className="incar-focus rounded-sm font-semibold text-white hover:text-metallic-silver"
                    >
                      {item.publicReference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-metallic-silver">{item.customerCompanyName}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.status}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.currency}</td>
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
          itemLabel="quotes"
          onOffsetChange={setOffset}
        />
      ) : null}
    </div>
  );
}
