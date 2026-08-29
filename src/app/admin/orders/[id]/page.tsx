"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AdminApiError,
  adminFetchPaymentProofObjectUrl,
  adminGetOrder,
  adminUpdateOrderStatus,
} from "@/features/admin/api/client";
import type { AdminOrderDetail } from "@/features/admin/api/contracts";

type DetailState =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error"; message: string }
  | { kind: "ready"; order: AdminOrderDetail };

// Informational only — the server (order-status-transition.ts) is the real
// enforcement. Deliberately omits 'awaiting-payment-review' as a target: the
// admin schema never allows it as a direct PATCH target, that transition is
// only reachable via the customer payment-proof resubmission flow.
const NEXT_STATUSES: Readonly<Record<string, readonly string[]>> = {
  "awaiting-payment-review": ["payment-confirmed", "payment-rejected", "cancelled"],
  "payment-confirmed": ["shipped", "cancelled"],
  "payment-rejected": [],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function PaymentProofImage({ orderId, proofId, filename }: { orderId: string; proofId: string; filename: string }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    adminFetchPaymentProofObjectUrl(orderId, proofId)
      .then((created) => {
        if (cancelled) {
          URL.revokeObjectURL(created);
          return;
        }
        url = created;
        setObjectUrl(created);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [orderId, proofId]);

  if (failed) return <p className="text-sm text-muted">Could not load {filename}.</p>;
  if (!objectUrl) return <p className="text-sm text-muted">Loading {filename}…</p>;
  // eslint-disable-next-line @next/next/no-img-element -- object URL, not an optimizable remote/static asset
  return <img src={objectUrl} alt={filename} className="max-h-96 w-full rounded-md border border-border object-contain" />;
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [state, setState] = useState<DetailState>({ kind: "loading" });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminGetOrder(id)
      .then((order) => {
        if (!cancelled) setState({ kind: "ready", order });
      })
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
          message: caught instanceof AdminApiError ? caught.message : "Failed to load order.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function handleStatusChange(nextStatus: string) {
    setUpdating(true);
    setUpdateError(null);
    try {
      const updated = await adminUpdateOrderStatus(id, nextStatus);
      setState({ kind: "ready", order: updated });
    } catch (caught) {
      setUpdateError(caught instanceof AdminApiError ? caught.message : "Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  }

  if (state.kind === "loading") return <p className="text-sm text-muted">Loading…</p>;
  if (state.kind === "not-found") return <p className="text-sm text-muted">Order not found.</p>;
  if (state.kind === "error") {
    return (
      <p className="rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
        {state.message}
      </p>
    );
  }

  const order = state.order;
  const nextStatuses = NEXT_STATUSES[order.status] ?? [];

  return (
    <div>
      <Link href="/admin/orders" className="incar-focus text-sm text-metallic-silver hover:text-white">
        ← Back to orders
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 dir="ltr" className="text-2xl font-semibold text-white">{order.publicReference}</h1>
          <p className="mt-1 text-sm text-muted">
            {order.contactName} · {order.phone} · {order.email}
          </p>
        </div>
        <span className="rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-sm font-semibold text-white">
          {order.status}
        </span>
      </div>

      <div className="incar-card mt-6 grid gap-4 rounded-lg p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Subtotal</p>
          <p dir="ltr" className="mt-1 text-white">${order.subtotalUsd} {order.currency}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Total</p>
          <p dir="ltr" className="mt-1 font-semibold text-white">${order.totalUsd} {order.currency}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Shipping address</p>
          <p className="mt-1 text-white">
            {order.addressLine1}
            {order.addressLine2 ? `, ${order.addressLine2}` : ""}, {order.city}, {order.country}
            {order.postalCode ? ` ${order.postalCode}` : ""}
          </p>
        </div>
        {order.whatsapp ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">WhatsApp</p>
            <p dir="ltr" className="mt-1 text-white">{order.whatsapp}</p>
          </div>
        ) : null}
        {order.customerNotes ? (
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Customer notes</p>
            <p className="mt-1 text-white">{order.customerNotes}</p>
          </div>
        ) : null}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Payment confirmed</p>
          <p className="mt-1 text-white">{formatDate(order.paymentConfirmedAt)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Payment rejected</p>
          <p className="mt-1 text-white">{formatDate(order.paymentRejectedAt)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Shipped</p>
          <p className="mt-1 text-white">{formatDate(order.shippedAt)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Delivered</p>
          <p className="mt-1 text-white">{formatDate(order.deliveredAt)}</p>
        </div>
      </div>

      {updateError ? (
        <p className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          {updateError}
        </p>
      ) : null}

      <div className="incar-card mt-6 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white">Line items</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">Part number</th>
                <th className="py-2 pr-3">Qty</th>
                <th className="py-2 pr-3">Unit price</th>
                <th className="py-2 pr-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-3 text-white">{item.nameEn}</td>
                  <td dir="ltr" className="py-2 pr-3 text-metallic-silver">{item.partNumber}</td>
                  <td className="py-2 pr-3 text-metallic-silver">{item.quantity}</td>
                  <td dir="ltr" className="py-2 pr-3 text-metallic-silver">${item.unitPriceUsd}</td>
                  <td dir="ltr" className="py-2 pr-3 text-white">
                    ${(Number(item.unitPriceUsd) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="incar-card mt-6 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white">Payment proofs</h2>
        {order.paymentProofs.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No payment proof uploaded.</p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {order.paymentProofs.map((proof) => (
              <div key={proof.id}>
                <p className="mb-2 text-xs text-muted">
                  {proof.filename} · {formatDate(proof.uploadedAt)}
                </p>
                <PaymentProofImage orderId={order.id} proofId={proof.id} filename={proof.filename} />
              </div>
            ))}
          </div>
        )}
      </div>

      {nextStatuses.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {nextStatuses.map((next) => (
            <button
              key={next}
              type="button"
              onClick={() => void handleStatusChange(next)}
              disabled={updating}
              className="incar-focus min-h-11 rounded-md border border-border px-5 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? "Updating…" : `Mark as ${next}`}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
