"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  AdminApiError,
  adminAddAccountAdjustment,
  adminGetAccount,
  adminIssueRefund,
} from "@/features/admin/api/client";
import {
  ADMIN_COMMISSION_STATES,
  type AdminAccountResponse,
  type AdminAccountTransaction,
  type AdminCommissionState,
} from "@/features/admin/api/contracts";

const PAGE_SIZE = 20;

type PanelState =
  | { kind: "loading" }
  | { kind: "ready"; data: AdminAccountResponse }
  | { kind: "error"; message: string };

const TYPE_LABEL: Record<string, string> = {
  "quote-obligation": "Quote obligation",
  "order-payment": "Order payment",
  refund: "Refund",
  "manual-adjustment": "Manual adjustment",
};

const COMMISSION_LABEL: Record<string, string> = {
  "not-applicable": "—",
  "tracked-separately": "Tracked separately",
  "baked-in": "Baked into price",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function formatMoney(amountUsd: string): string {
  const value = Number(amountUsd);
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function CommissionFields({
  state,
  amount,
  onStateChange,
  onAmountChange,
}: {
  state: AdminCommissionState;
  amount: string;
  onStateChange: (value: AdminCommissionState) => void;
  onAmountChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold text-white">
        Commission
        <select
          value={state}
          onChange={(event) => onStateChange(event.target.value as AdminCommissionState)}
          className="incar-input min-h-11 px-4 text-sm"
        >
          {ADMIN_COMMISSION_STATES.map((option) => (
            <option key={option} value={option}>
              {COMMISSION_LABEL[option]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-white">
        Commission amount (USD)
        <input
          type="number"
          step={0.01}
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          disabled={state === "not-applicable"}
          placeholder={state === "not-applicable" ? "N/A" : "0.00"}
          className="incar-input min-h-11 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>
    </div>
  );
}

/** The per-customer ledger view. Commission is admin-only reporting metadata
 * here — it never affects balanceUsd and must never be surfaced on any
 * customer-facing quote/order view. */
export function AdminCustomerAccountPanel({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [state, setState] = useState<PanelState>({ kind: "loading" });
  const [refreshKey, setRefreshKey] = useState(0);

  const [showAdjustment, setShowAdjustment] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentDescription, setAdjustmentDescription] = useState("");
  const [adjustmentCommissionState, setAdjustmentCommissionState] =
    useState<AdminCommissionState>("not-applicable");
  const [adjustmentCommissionAmount, setAdjustmentCommissionAmount] = useState("");
  const [adjustmentSaving, setAdjustmentSaving] = useState(false);
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);

  const [refundTargetId, setRefundTargetId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundDescription, setRefundDescription] = useState("");
  const [refundSaving, setRefundSaving] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminGetAccount(customerId, {
      limit: PAGE_SIZE,
      offset,
      type: typeFilter ? (typeFilter as AdminAccountTransaction["type"]) : undefined,
    })
      .then((data) => {
        if (!cancelled) setState({ kind: "ready", data });
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          router.push("/admin/login");
          return;
        }
        setState({
          kind: "error",
          message: caught instanceof AdminApiError ? caught.message : "Failed to load account.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [customerId, offset, typeFilter, refreshKey, router]);

  async function handleAdjustmentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdjustmentSaving(true);
    setAdjustmentError(null);
    try {
      await adminAddAccountAdjustment(customerId, {
        amountUsd: Number(adjustmentAmount),
        description: adjustmentDescription.trim(),
        commissionState: adjustmentCommissionState,
        commissionAmountUsd:
          adjustmentCommissionState === "not-applicable"
            ? undefined
            : Number(adjustmentCommissionAmount),
      });
      setShowAdjustment(false);
      setAdjustmentAmount("");
      setAdjustmentDescription("");
      setAdjustmentCommissionState("not-applicable");
      setAdjustmentCommissionAmount("");
      setOffset(0);
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      setAdjustmentError(caught instanceof AdminApiError ? caught.message : "Failed to add adjustment.");
    } finally {
      setAdjustmentSaving(false);
    }
  }

  async function handleRefundSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!refundTargetId) return;
    setRefundSaving(true);
    setRefundError(null);
    try {
      await adminIssueRefund(refundTargetId, {
        amountUsd: Number(refundAmount),
        description: refundDescription.trim(),
      });
      setRefundTargetId(null);
      setRefundAmount("");
      setRefundDescription("");
      setOffset(0);
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      setRefundError(caught instanceof AdminApiError ? caught.message : "Failed to issue refund.");
    } finally {
      setRefundSaving(false);
    }
  }

  if (state.kind === "loading") {
    return <p className="mt-4 text-sm text-muted">Loading account…</p>;
  }
  if (state.kind === "error") {
    return (
      <p className="mt-4 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
        {state.message}
      </p>
    );
  }

  const { summary, transactions } = state.data;

  return (
    <div className="mt-4">
      <div className="incar-card grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg p-6 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-muted">Balance (USD)</p>
          <p className="mt-1 text-lg font-semibold text-white">{formatMoney(summary.balanceUsd)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-muted">Outstanding orders</p>
          <p className="mt-1 text-lg font-semibold text-white">${Number(summary.outstandingOrdersUsd).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-muted">Outstanding quotes</p>
          <p className="mt-1 text-lg font-semibold text-white">${Number(summary.outstandingQuotesUsd).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-muted">Total commission (admin-only)</p>
          <p className="mt-1 text-lg font-semibold text-white">${Number(summary.totalCommissionUsd).toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="grid gap-1 text-xs font-semibold text-muted">
          Filter by type
          <select
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setOffset(0);
            }}
            className="incar-input min-h-9 px-3 text-sm"
          >
            <option value="">All types</option>
            <option value="quote-obligation">Quote obligation</option>
            <option value="order-payment">Order payment</option>
            <option value="refund">Refund</option>
            <option value="manual-adjustment">Manual adjustment</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => setShowAdjustment((open) => !open)}
          className="incar-focus min-h-10 rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
        >
          {showAdjustment ? "Cancel" : "Add manual adjustment"}
        </button>
      </div>

      {showAdjustment ? (
        <form
          onSubmit={handleAdjustmentSubmit}
          className="incar-card mt-3 grid gap-4 rounded-lg p-6 sm:max-w-xl"
        >
          <label className="grid gap-2 text-sm font-semibold text-white">
            Amount (USD) — positive increases what the customer owes, negative decreases it
            <input
              type="number"
              step={0.01}
              required
              value={adjustmentAmount}
              onChange={(event) => setAdjustmentAmount(event.target.value)}
              className="incar-input min-h-11 px-4 text-sm"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-white">
            Description
            <textarea
              required
              rows={2}
              value={adjustmentDescription}
              onChange={(event) => setAdjustmentDescription(event.target.value)}
              className="incar-input px-4 py-3 text-sm"
            />
          </label>
          <CommissionFields
            state={adjustmentCommissionState}
            amount={adjustmentCommissionAmount}
            onStateChange={setAdjustmentCommissionState}
            onAmountChange={setAdjustmentCommissionAmount}
          />
          {adjustmentError ? (
            <p role="alert" className="rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
              {adjustmentError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={adjustmentSaving}
            className="incar-focus min-h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adjustmentSaving ? "Saving…" : "Add adjustment"}
          </button>
        </form>
      ) : null}

      {transactions.items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No transactions yet.</p>
      ) : (
        <div className="incar-card mt-4 overflow-x-auto rounded-lg">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount (USD)</th>
                <th className="px-4 py-3">Commission (admin-only)</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">By</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {transactions.items.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border/60 last:border-0 align-top">
                  <td className="px-4 py-3 text-muted">{formatDate(transaction.createdAt)}</td>
                  <td className="px-4 py-3 text-metallic-silver">{TYPE_LABEL[transaction.type] ?? transaction.type}</td>
                  <td className="px-4 py-3 font-semibold text-white">{formatMoney(transaction.amountUsd)}</td>
                  <td className="px-4 py-3 text-metallic-silver">
                    {transaction.commissionState === "not-applicable"
                      ? "—"
                      : `${COMMISSION_LABEL[transaction.commissionState]} ($${Number(transaction.commissionAmountUsd ?? 0).toFixed(2)})`}
                  </td>
                  <td className="px-4 py-3 text-metallic-silver">{transaction.description ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{transaction.createdByAdmin ?? "—"}</td>
                  <td className="px-4 py-3">
                    {transaction.amountUsd.startsWith("-") && !transaction.refundOfTransactionId ? (
                      <button
                        type="button"
                        onClick={() => {
                          setRefundTargetId(transaction.id);
                          setRefundAmount("");
                          setRefundDescription("");
                          setRefundError(null);
                        }}
                        className="incar-focus min-h-8 rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white"
                      >
                        Refund
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>
          {transactions.total === 0
            ? "0 transactions"
            : `${offset + 1}–${Math.min(offset + transactions.items.length, transactions.total)} of ${transactions.total}`}
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
            disabled={offset + PAGE_SIZE >= transactions.total}
            className="incar-focus min-h-9 rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {refundTargetId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleRefundSubmit}
            className="incar-card w-full max-w-md rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-white">Issue refund</h3>
            <p className="mt-1 text-sm text-muted">
              Records a positive ledger entry referencing the original payment.
            </p>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-white">
              Refund amount (USD)
              <input
                type="number"
                step={0.01}
                min={0.01}
                required
                value={refundAmount}
                onChange={(event) => setRefundAmount(event.target.value)}
                className="incar-input min-h-11 px-4 text-sm"
              />
            </label>
            <label className="mt-3 grid gap-2 text-sm font-semibold text-white">
              Description
              <textarea
                required
                rows={2}
                value={refundDescription}
                onChange={(event) => setRefundDescription(event.target.value)}
                className="incar-input px-4 py-3 text-sm"
              />
            </label>
            {refundError ? (
              <p role="alert" className="mt-3 rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
                {refundError}
              </p>
            ) : null}
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRefundTargetId(null)}
                className="incar-focus min-h-10 rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={refundSaving}
                className="incar-focus min-h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refundSaving ? "Saving…" : "Issue refund"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
