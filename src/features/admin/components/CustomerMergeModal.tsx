"use client";

import { useEffect, useRef, useState } from "react";
import {
  AdminApiError,
  adminGetCustomer,
  adminListCustomers,
  adminMergeCustomers,
} from "@/features/admin/api/client";
import type {
  AdminCustomerDetail,
  AdminCustomerMergeResponse,
  AdminCustomerSummary,
} from "@/features/admin/api/contracts";

const SEARCH_DEBOUNCE_MS = 300;

type Step =
  | { kind: "picking"; query: string; results: AdminCustomerSummary[]; searching: boolean }
  | { kind: "loading-target" }
  | { kind: "previewing"; target: AdminCustomerDetail }
  | { kind: "merging"; target: AdminCustomerDetail }
  | { kind: "error"; message: string; target: AdminCustomerDetail | null };

function fieldLabel(field: string | null): string {
  return field && field.trim().length > 0 ? field : "—";
}

/** Mirrors the backend's merge backfill rule exactly (admin-customers.repository.ts):
 * a field transfers from the merged-away record only when the surviving
 * customer's own value is empty. specialDiscountRate is deliberately never
 * backfilled — shown for visibility, not as a transferring field. */
function willTransfer(survivorValue: string | null, targetValue: string | null): boolean {
  return !(survivorValue && survivorValue.trim().length > 0) && !!targetValue?.trim();
}

function resultingValue(survivorValue: string | null, targetValue: string | null): string | null {
  return survivorValue && survivorValue.trim().length > 0 ? survivorValue : targetValue;
}

interface PreviewRow {
  label: string;
  survivorValue: string | null;
  targetValue: string | null;
  transfers: boolean;
}

function buildPreviewRows(survivor: AdminCustomerDetail, target: AdminCustomerDetail): PreviewRow[] {
  const fields: { label: string; key: keyof AdminCustomerDetail }[] = [
    { label: "Phone", key: "phone" },
    { label: "WhatsApp", key: "whatsapp" },
    { label: "Country", key: "country" },
    { label: "Category", key: "businessType" },
    { label: "Internal notes", key: "internalNotes" },
  ];
  return fields.map(({ label, key }) => {
    const survivorValue = survivor[key] as string | null;
    const targetValue = target[key] as string | null;
    return { label, survivorValue, targetValue, transfers: willTransfer(survivorValue, targetValue) };
  });
}

export function CustomerMergeModal({
  survivor,
  onClose,
  onMerged,
}: {
  survivor: AdminCustomerDetail;
  onClose: () => void;
  onMerged: (result: AdminCustomerMergeResponse) => void;
}) {
  const [step, setStep] = useState<Step>({
    kind: "picking",
    query: "",
    results: [],
    searching: false,
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (step.kind !== "picking" || step.query.trim().length < 2) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      setStep((current) => (current.kind === "picking" ? { ...current, searching: true } : current));
      adminListCustomers(10, 0, step.query.trim())
        .then((page) => {
          if (cancelled) return;
          setStep((current) =>
            current.kind === "picking"
              ? {
                  ...current,
                  results: page.items.filter((item) => item.id !== survivor.id),
                  searching: false,
                }
              : current,
          );
        })
        .catch(() => {
          if (cancelled) return;
          setStep((current) =>
            current.kind === "picking" ? { ...current, results: [], searching: false } : current,
          );
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // step.query is the only reactive input; results/searching are derived, not deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.kind === "picking" ? step.query : null, survivor.id]);

  function selectCandidate(id: string) {
    setStep({ kind: "loading-target" });
    adminGetCustomer(id)
      .then((target) => setStep({ kind: "previewing", target }))
      .catch((caught: unknown) => {
        setStep({
          kind: "error",
          target: null,
          message: caught instanceof AdminApiError ? caught.message : "Failed to load that customer.",
        });
      });
  }

  function confirmMerge(target: AdminCustomerDetail) {
    setStep({ kind: "merging", target });
    adminMergeCustomers(survivor.id, target.id)
      .then((result) => onMerged(result))
      .catch((caught: unknown) => {
        setStep({
          kind: "error",
          target,
          message: caught instanceof AdminApiError ? caught.message : "The merge failed.",
        });
      });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Merge customer"
        className="incar-card-elevated relative z-10 grid max-h-[85vh] w-full max-w-2xl gap-4 overflow-y-auto rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Merge a duplicate into {survivor.contactName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="incar-focus inline-flex size-9 items-center justify-center rounded-md border border-border text-soft-silver hover:border-metallic-silver/40 hover:text-white"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {step.kind === "picking" ? (
          <div className="grid gap-3">
            <p className="text-sm text-muted">
              Find the duplicate customer record to merge into this one. Its requests move here and
              it is permanently marked as merged.
            </p>
            <input
              autoFocus
              value={step.query}
              onChange={(event) =>
                setStep({ kind: "picking", query: event.target.value, results: [], searching: false })
              }
              placeholder="Search by company, contact, or email"
              className="incar-input min-h-11 px-4 text-sm"
            />
            {step.searching ? <p className="text-sm text-muted">Searching…</p> : null}
            {!step.searching && step.query.trim().length >= 2 && step.results.length === 0 ? (
              <p className="text-sm text-muted">No matching customers.</p>
            ) : null}
            <div className="grid gap-2">
              {step.results.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => selectCandidate(candidate.id)}
                  className="incar-focus rounded-md border border-border bg-surface-elevated px-4 py-3 text-left text-sm transition hover:border-metallic-silver/40"
                >
                  <span className="block font-semibold text-white">{candidate.contactName}</span>
                  <span className="block text-metallic-silver">
                    {candidate.companyName} · {candidate.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step.kind === "loading-target" ? <p className="text-sm text-muted">Loading…</p> : null}

        {step.kind === "previewing" || step.kind === "merging" ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted">
              Review what changes before confirming — this cannot be undone.
            </p>

            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Keeping ({survivor.contactName})</th>
                    <th className="px-3 py-2">Merging away ({step.target.contactName})</th>
                    <th className="px-3 py-2">After merge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/60">
                    <td className="px-3 py-2 text-muted">Contact / Company / Email</td>
                    <td className="px-3 py-2 text-white" colSpan={2}>
                      {survivor.contactName} · {survivor.companyName} · {survivor.email}
                    </td>
                    <td className="px-3 py-2 text-metallic-silver">Unchanged</td>
                  </tr>
                  {buildPreviewRows(survivor, step.target).map((row) => (
                    <tr key={row.label} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-2 text-muted">{row.label}</td>
                      <td className="px-3 py-2 text-white">{fieldLabel(row.survivorValue)}</td>
                      <td
                        className={`px-3 py-2 ${row.transfers ? "text-muted line-through" : "text-metallic-silver"}`}
                      >
                        {fieldLabel(row.targetValue)}
                      </td>
                      <td className={`px-3 py-2 ${row.transfers ? "font-semibold text-primary" : "text-metallic-silver"}`}>
                        {fieldLabel(resultingValue(row.survivorValue, row.targetValue))}
                        {row.transfers ? " (transfers)" : ""}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-border/60">
                    <td className="px-3 py-2 text-muted">Discount rate</td>
                    <td className="px-3 py-2 text-white">{fieldLabel(survivor.specialDiscountRate)}</td>
                    <td className="px-3 py-2 text-metallic-silver">
                      {fieldLabel(step.target.specialDiscountRate)}
                    </td>
                    <td className="px-3 py-2 text-metallic-silver">
                      {fieldLabel(survivor.specialDiscountRate)} (never transfers)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-muted">Linked requests</td>
                    <td className="px-3 py-2 text-white">{survivor.requestCount}</td>
                    <td className="px-3 py-2 text-metallic-silver">{step.target.requestCount}</td>
                    <td className="px-3 py-2 font-semibold text-primary">
                      {survivor.requestCount + step.target.requestCount} (moved here)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStep({ kind: "picking", query: "", results: [], searching: false })}
                disabled={step.kind === "merging"}
                className="incar-focus min-h-11 rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => confirmMerge(step.target)}
                disabled={step.kind === "merging"}
                className="incar-focus min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {step.kind === "merging" ? "Merging…" : "Confirm merge"}
              </button>
            </div>
          </div>
        ) : null}

        {step.kind === "error" ? (
          <div className="grid gap-3">
            <p className="rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
              {step.message}
            </p>
            <button
              type="button"
              onClick={() =>
                step.target
                  ? setStep({ kind: "previewing", target: step.target })
                  : setStep({ kind: "picking", query: "", results: [], searching: false })
              }
              className="incar-focus min-h-11 rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
            >
              Back
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
