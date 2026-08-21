"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { AdminApiError, adminGetCustomer, adminUpdateCustomer } from "@/features/admin/api/client";
import { ADMIN_CUSTOMER_BUSINESS_TYPES, type AdminCustomerDetail } from "@/features/admin/api/contracts";
import { AdminRequestsList } from "@/features/admin/components/AdminRequestsList";
import { CustomerMergeModal } from "@/features/admin/components/CustomerMergeModal";

type DetailState =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error"; message: string }
  | { kind: "ready"; customer: AdminCustomerDetail };

const fieldLabel = "text-xs uppercase tracking-[0.08em] text-muted";
const fieldValue = "mt-1 text-sm text-white";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [detailState, setDetailState] = useState<DetailState>({ kind: "loading" });
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [mergeNotice, setMergeNotice] = useState<string | null>(null);
  // AdminRequestsList only refetches when its own customerId/offset props
  // change — a merge moves requests onto this same id without changing
  // either, so bump this to force a remount (and therefore a fresh fetch).
  const [linkedRequestsVersion, setLinkedRequestsVersion] = useState(0);

  const [businessType, setBusinessType] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [saveState, setSaveState] = useState<{ kind: "idle" | "saving" | "error"; message?: string }>({
    kind: "idle",
  });

  useEffect(() => {
    let cancelled = false;
    adminGetCustomer(id)
      .then((customer) => {
        if (cancelled) return;
        setDetailState({ kind: "ready", customer });
        setBusinessType(customer.businessType ?? "");
        setInternalNotes(customer.internalNotes ?? "");
        setDiscountRate(customer.specialDiscountRate ?? "");
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
          message: caught instanceof AdminApiError ? caught.message : "Failed to load customer.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveState({ kind: "saving" });
    try {
      const updated = await adminUpdateCustomer(id, {
        businessType: businessType || null,
        internalNotes: internalNotes.trim() || null,
        specialDiscountRate: discountRate.trim() === "" ? null : Number(discountRate),
      });
      setDetailState({ kind: "ready", customer: updated });
      setBusinessType(updated.businessType ?? "");
      setInternalNotes(updated.internalNotes ?? "");
      setDiscountRate(updated.specialDiscountRate ?? "");
      setSaveState({ kind: "idle" });
    } catch (caught) {
      setSaveState({
        kind: "error",
        message: caught instanceof AdminApiError ? caught.message : "Failed to save changes.",
      });
    }
  }

  if (detailState.kind === "loading") {
    return <p className="text-sm text-muted">Loading…</p>;
  }
  if (detailState.kind === "not-found") {
    return <p className="text-sm text-muted">Customer not found.</p>;
  }
  if (detailState.kind === "error") {
    return (
      <p className="rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
        {detailState.message}
      </p>
    );
  }

  const customer = detailState.customer;
  const isMerged = customer.mergedIntoCustomerId !== null;

  return (
    <div>
      <Link href="/admin/customers" className="incar-focus text-sm text-metallic-silver hover:text-white">
        ← Back to customers
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">{customer.contactName}</h1>
        {!isMerged ? (
          <button
            type="button"
            onClick={() => setMergeModalOpen(true)}
            className="incar-focus min-h-10 rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
          >
            Merge a duplicate into this customer
          </button>
        ) : null}
      </div>

      {isMerged ? (
        <p className="mt-4 rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
          This record was merged into{" "}
          <Link href={`/admin/customers/${customer.mergedIntoCustomerId}`} className="incar-focus font-semibold underline">
            another customer
          </Link>
          . It is kept for history but can no longer be edited, and its requests have moved there.
        </p>
      ) : null}

      {mergeNotice ? (
        <p className="mt-4 rounded-md border border-metallic-silver/25 bg-surface-elevated p-3 text-sm text-soft-silver">
          {mergeNotice}
        </p>
      ) : null}

      <div className="incar-card mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg p-6 sm:grid-cols-3">
        <div>
          <p className={fieldLabel}>Company</p>
          <p className={fieldValue}>{customer.companyName}</p>
        </div>
        <div>
          <p className={fieldLabel}>Email</p>
          <p className={fieldValue}>{customer.email}</p>
        </div>
        <div>
          <p className={fieldLabel}>Phone</p>
          <p className={fieldValue}>{customer.phone ?? "—"}</p>
        </div>
        <div>
          <p className={fieldLabel}>WhatsApp</p>
          <p className={fieldValue}>{customer.whatsapp ?? "—"}</p>
        </div>
        <div>
          <p className={fieldLabel}>Country</p>
          <p className={fieldValue}>{customer.country ?? "—"}</p>
        </div>
        <div>
          <p className={fieldLabel}>First contact</p>
          <p className={fieldValue}>{formatDate(customer.createdAt)}</p>
        </div>
        <div>
          <p className={fieldLabel}>Linked requests</p>
          <p className={fieldValue}>{customer.requestCount}</p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-white">Admin fields</h2>
      <p className="mt-1 text-sm text-muted">Never shown to the customer.</p>
      <form onSubmit={handleSave} className="incar-card mt-4 grid gap-4 rounded-lg p-6 sm:max-w-xl">
        <label className="grid gap-2 text-sm font-semibold text-white">
          Category
          <select
            value={businessType}
            onChange={(event) => setBusinessType(event.target.value)}
            disabled={isMerged}
            className="incar-input min-h-11 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">— None —</option>
            {ADMIN_CUSTOMER_BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-white">
          Special discount rate (%)
          <input
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={discountRate}
            onChange={(event) => setDiscountRate(event.target.value)}
            disabled={isMerged}
            placeholder="No discount set"
            className="incar-input min-h-11 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-white">
          Internal notes
          <textarea
            value={internalNotes}
            onChange={(event) => setInternalNotes(event.target.value)}
            disabled={isMerged}
            rows={4}
            className="incar-input px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        {saveState.kind === "error" ? (
          <p role="alert" className="rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
            {saveState.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isMerged || saveState.kind === "saving"}
          className="incar-focus min-h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saveState.kind === "saving" ? "Saving…" : "Save changes"}
        </button>
      </form>

      <h2 className="mt-8 text-lg font-semibold text-white">Linked requests</h2>
      <div className="mt-4">
        <AdminRequestsList key={linkedRequestsVersion} customerId={id} />
      </div>

      {mergeModalOpen ? (
        <CustomerMergeModal
          survivor={customer}
          onClose={() => setMergeModalOpen(false)}
          onMerged={(result) => {
            setDetailState({ kind: "ready", customer: result.survivor });
            setMergeModalOpen(false);
            setLinkedRequestsVersion((version) => version + 1);
            setMergeNotice(
              `Merge complete — ${result.movedRequestCount} request${result.movedRequestCount === 1 ? "" : "s"} moved to this customer.`,
            );
          }}
        />
      ) : null}
    </div>
  );
}
