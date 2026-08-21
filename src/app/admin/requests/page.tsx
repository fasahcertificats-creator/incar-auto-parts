"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminApiError, adminListRequests } from "@/features/admin/api/client";
import type { AdminRequestListResponse } from "@/features/admin/api/contracts";

const PAGE_SIZE = 20;

const KIND_LABEL: Record<string, string> = { rfq: "RFQ", inquiry: "Inquiry" };

type ListState =
  | { kind: "loading" }
  | { kind: "ready"; page: AdminRequestListResponse }
  | { kind: "error"; message: string };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminRequestListPage() {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [state, setState] = useState<ListState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    adminListRequests(PAGE_SIZE, offset)
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
          message: caught instanceof AdminApiError ? caught.message : "Failed to load requests.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [offset, router]);

  const page = state.kind === "ready" ? state.page : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Requests</h1>
      <p className="mt-2 text-sm text-muted">
        Product RFQ, Bulk RFQ, Contact, Private Label, and Catalog Request submissions, most
        recent first.
      </p>

      {state.kind === "error" ? (
        <p className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          {state.message}
        </p>
      ) : null}

      {state.kind === "loading" ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}

      {page && page.items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No requests yet.</p>
      ) : null}

      {page && page.items.length > 0 ? (
        <div className="incar-card mt-6 overflow-x-auto rounded-lg">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {page.items.map((item) => (
                <tr key={`${item.kind}-${item.id}`} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/requests/${item.kind}/${item.id}`}
                      className="incar-focus rounded-sm font-semibold text-white hover:text-metallic-silver"
                    >
                      {item.publicReference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-metallic-silver">
                    {KIND_LABEL[item.kind] ?? item.kind} · {item.type}
                  </td>
                  <td className="px-4 py-3 text-metallic-silver">{item.status}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.companyName}</td>
                  <td className="px-4 py-3 text-metallic-silver">{item.contactName ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {page ? (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            {page.total === 0
              ? "0 requests"
              : `${offset + 1}–${Math.min(offset + page.items.length, page.total)} of ${page.total}`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              disabled={offset === 0}
              className="incar-focus min-h-9 rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setOffset(offset + PAGE_SIZE)}
              disabled={offset + PAGE_SIZE >= page.total}
              className="incar-focus min-h-9 rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
