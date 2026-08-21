"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  AdminApiError,
  adminGetInquiryDetail,
  adminGetRfqDetail,
  adminUpdateInquiryStatus,
  adminUpdateRfqStatus,
} from "@/features/admin/api/client";
import {
  ADMIN_INQUIRY_STATUSES,
  ADMIN_RFQ_STATUSES,
  type AdminInquiryDetail,
  type AdminRfqRequestDetail,
} from "@/features/admin/api/contracts";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

const fieldLabel = "text-xs uppercase tracking-[0.08em] text-muted";
const fieldValue = "mt-1 text-sm text-white";

type DetailState =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error"; message: string }
  | { kind: "ready"; detail: AdminRfqRequestDetail | AdminInquiryDetail };

export default function AdminRequestDetailPage() {
  const params = useParams<{ kind: string; id: string }>();
  const router = useRouter();
  const routeKind = params.kind === "inquiry" ? "inquiry" : "rfq";
  const id = params.id;

  const [detailState, setDetailState] = useState<DetailState>({ kind: "loading" });
  const [status, setStatus] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const promise = routeKind === "rfq" ? adminGetRfqDetail(id) : adminGetInquiryDetail(id);
    promise
      .then((result) => {
        if (cancelled) return;
        setDetailState({ kind: "ready", detail: result });
        setStatus(result.status);
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (caught instanceof AdminApiError && caught.status === 404) {
          setDetailState({ kind: "not-found" });
          return;
        }
        setDetailState({
          kind: "error",
          message: caught instanceof AdminApiError ? caught.message : "Failed to load.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [routeKind, id, router]);

  const rfq = detailState.kind === "ready" && detailState.detail.kind === "rfq" ? detailState.detail : null;
  const inquiry =
    detailState.kind === "ready" && detailState.detail.kind === "inquiry" ? detailState.detail : null;

  async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      if (routeKind === "rfq") {
        const updated = await adminUpdateRfqStatus(id, status, internalNote.trim() || undefined);
        setDetailState({ kind: "ready", detail: updated });
      } else {
        const updated = await adminUpdateInquiryStatus(id, status);
        setDetailState({ kind: "ready", detail: updated });
      }
      setInternalNote("");
    } catch (caught) {
      setSaveError(
        caught instanceof AdminApiError ? caught.message : "Failed to update status.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (detailState.kind === "loading") return <p className="text-sm text-muted">Loading…</p>;
  if (detailState.kind === "not-found") {
    return (
      <div>
        <p className="text-sm text-white">This request could not be found.</p>
        <Link href="/admin/requests" className="mt-4 inline-block text-sm text-metallic-silver hover:text-white">
          ← Back to requests
        </Link>
      </div>
    );
  }
  if (detailState.kind === "error") {
    return <p className="rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">{detailState.message}</p>;
  }

  const detail = detailState.detail;
  const statusOptions = routeKind === "rfq" ? ADMIN_RFQ_STATUSES : ADMIN_INQUIRY_STATUSES;

  return (
    <div>
      <Link href="/admin/requests" className="text-sm text-metallic-silver hover:text-white">
        ← Back to requests
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">{detail.publicReference}</h1>
        <span className="rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-metallic-silver">
          {detail.status}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="incar-card rounded-lg p-6">
          {rfq ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className={fieldLabel}>Request type</p>
                <p className={fieldValue}>{rfq.requestType}</p>
              </div>
              <div>
                <p className={fieldLabel}>Market</p>
                <p className={fieldValue}>{rfq.marketCountryCode}</p>
              </div>
              <div>
                <p className={fieldLabel}>Submitted</p>
                <p className={fieldValue}>{formatDate(rfq.submittedAt)}</p>
              </div>
              <div>
                <p className={fieldLabel}>Closed</p>
                <p className={fieldValue}>{formatDate(rfq.closedAt)}</p>
              </div>
              {rfq.contact ? (
                <>
                  <div className="sm:col-span-2">
                    <p className={fieldLabel}>Company</p>
                    <p className={fieldValue}>{rfq.contact.companyName}</p>
                  </div>
                  <div>
                    <p className={fieldLabel}>Contact</p>
                    <p className={fieldValue}>{rfq.contact.contactName}</p>
                  </div>
                  <div>
                    <p className={fieldLabel}>Email</p>
                    <p className={fieldValue}>{rfq.contact.email}</p>
                  </div>
                  <div>
                    <p className={fieldLabel}>Phone</p>
                    <p className={fieldValue}>{rfq.contact.phone ?? "—"}</p>
                  </div>
                  <div>
                    <p className={fieldLabel}>WhatsApp</p>
                    <p className={fieldValue}>{rfq.contact.whatsapp ?? "—"}</p>
                  </div>
                </>
              ) : null}
              {rfq.customerNotes ? (
                <div className="sm:col-span-2">
                  <p className={fieldLabel}>Notes</p>
                  <p className={fieldValue}>{rfq.customerNotes}</p>
                </div>
              ) : null}

              {rfq.items.length > 0 ? (
                <div className="sm:col-span-2">
                  <p className={fieldLabel}>Items</p>
                  <div className="mt-2 overflow-x-auto rounded-md border border-border">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-[0.06em] text-muted">
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">Part / OEM</th>
                          <th className="px-3 py-2">Qty</th>
                          <th className="px-3 py-2">Vehicle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rfq.items.map((item) => (
                          <tr key={item.id} className="border-b border-border/60 last:border-0">
                            <td className="px-3 py-2 text-muted">{item.lineNumber}</td>
                            <td className="px-3 py-2 text-white">
                              {item.partNumber ?? item.oemReference ?? item.productName ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-metallic-silver">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-3 py-2 text-metallic-silver">
                              {[item.make, item.model, item.vehicleYear].filter(Boolean).join(" ") || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {inquiry ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className={fieldLabel}>Type</p>
                <p className={fieldValue}>{inquiry.type}</p>
              </div>
              <div>
                <p className={fieldLabel}>Received</p>
                <p className={fieldValue}>{formatDate(inquiry.createdAt)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className={fieldLabel}>Company</p>
                <p className={fieldValue}>{inquiry.companyName}</p>
              </div>
              <div>
                <p className={fieldLabel}>Contact</p>
                <p className={fieldValue}>{inquiry.fullName}</p>
              </div>
              <div>
                <p className={fieldLabel}>Email</p>
                <p className={fieldValue}>{inquiry.email ?? "—"}</p>
              </div>
              <div>
                <p className={fieldLabel}>WhatsApp</p>
                <p className={fieldValue}>{inquiry.whatsapp ?? "—"}</p>
              </div>
              <div>
                <p className={fieldLabel}>Location</p>
                <p className={fieldValue}>{[inquiry.city, inquiry.country].filter(Boolean).join(", ") || "—"}</p>
              </div>
              {inquiry.message ? (
                <div className="sm:col-span-2">
                  <p className={fieldLabel}>Message</p>
                  <p className={fieldValue}>{inquiry.message}</p>
                </div>
              ) : null}
              {Object.keys(inquiry.details).length > 0 ? (
                <div className="sm:col-span-2">
                  <p className={fieldLabel}>Additional details</p>
                  <dl className="mt-1 grid gap-1 text-sm">
                    {Object.entries(inquiry.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4 border-b border-border/40 py-1">
                        <dt className="text-muted">{key}</dt>
                        <dd className="text-white">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              <div>
                <p className={fieldLabel}>Responded</p>
                <p className={fieldValue}>{formatDate(inquiry.respondedAt)}</p>
              </div>
              <div>
                <p className={fieldLabel}>Closed</p>
                <p className={fieldValue}>{formatDate(inquiry.closedAt)}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="incar-card h-fit rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white">Change status</h2>
          <form onSubmit={handleStatusSubmit} className="mt-4 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-white">
              New status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="incar-input px-4 text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            {routeKind === "rfq" ? (
              <label className="grid gap-2 text-sm font-semibold text-white">
                Internal note (optional)
                <textarea
                  value={internalNote}
                  onChange={(event) => setInternalNote(event.target.value)}
                  className="incar-input min-h-24 px-4 py-3 text-sm"
                  maxLength={2000}
                />
              </label>
            ) : null}

            {saveError ? (
              <p role="alert" className="rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
                {saveError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving || status === detail.status}
              className="incar-focus min-h-11 rounded-md bg-primary text-sm font-semibold text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : "Update status"}
            </button>
          </form>

          {rfq && rfq.statusHistory.length > 0 ? (
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-white">History</h3>
              <ul className="mt-3 grid gap-3">
                {rfq.statusHistory.map((entry, index) => (
                  <li key={index} className="text-xs">
                    <p className="text-metallic-silver">
                      {entry.previousStatus ? `${entry.previousStatus} → ` : ""}
                      <span className="font-semibold text-white">{entry.newStatus}</span>
                      <span className="text-muted"> · {entry.actorType}</span>
                    </p>
                    <p className="text-muted">{formatDate(entry.changedAt)}</p>
                    {entry.internalNote ? <p className="mt-1 text-metallic-silver">{entry.internalNote}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
