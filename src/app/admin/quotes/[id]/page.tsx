"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  AdminApiError,
  adminDeleteQuoteAttachment,
  adminGetQuote,
  adminListProducts,
  adminSendQuote,
  adminUpdateQuote,
  adminUpdateQuoteStatus,
  adminUploadQuoteAttachment,
} from "@/features/admin/api/client";
import type {
  AdminProductSummary,
  AdminQuoteDetail,
  AdminQuoteLineItemInput,
} from "@/features/admin/api/contracts";

type DetailState =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error"; message: string }
  | { kind: "ready"; quote: AdminQuoteDetail };

type DraftLineItem = AdminQuoteLineItemInput & { key: string };

// Informational only — the server is the real enforcement (see
// quote-status-transition.ts on the backend). This just avoids offering a
// button that's guaranteed to fail.
const NEXT_STATUSES: Readonly<Record<string, readonly string[]>> = {
  sent: ["responded", "cancelled"],
  responded: ["accepted", "rejected", "cancelled"],
};

function toDraftLineItems(quote: AdminQuoteDetail): DraftLineItem[] {
  return quote.lineItems.map((item, index) => ({
    lineType: item.lineType,
    productId: item.productId,
    description: item.description,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    key: `${item.id}-${index}`,
  }));
}

function lineTotal(item: DraftLineItem): number {
  return item.quantity * item.unitPrice;
}

export default function AdminQuoteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [state, setState] = useState<DetailState>({ kind: "loading" });
  const [lineItems, setLineItems] = useState<DraftLineItem[]>([]);
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [products, setProducts] = useState<AdminProductSummary[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminGetQuote(id)
      .then((quote) => {
        if (cancelled) return;
        setState({ kind: "ready", quote });
        setLineItems(toDraftLineItems(quote));
        setInternalNotes(quote.internalNotes ?? "");
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
          message: caught instanceof AdminApiError ? caught.message : "Failed to load quote.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  useEffect(() => {
    adminListProducts(200, 0)
      .then((page) => setProducts(page.items))
      .catch(() => setProducts([]));
  }, []);

  function addManualLine() {
    setLineItems((current) => [
      ...current,
      { lineType: "manual", productId: null, description: "", quantity: 1, unitPrice: 0, key: crypto.randomUUID() },
    ]);
  }

  function addProductLine() {
    const first = products[0];
    setLineItems((current) => [
      ...current,
      {
        lineType: "product",
        productId: first?.id ?? null,
        description: first ? `${first.nameEn} (${first.partNumber})` : "",
        quantity: 1,
        unitPrice: 0,
        key: crypto.randomUUID(),
      },
    ]);
  }

  function updateLine(key: string, patch: Partial<DraftLineItem>) {
    setLineItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function removeLine(key: string) {
    setLineItems((current) => current.filter((item) => item.key !== key));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await adminUpdateQuote(id, {
        internalNotes: internalNotes.trim() || null,
        lineItems: lineItems.map((item) => ({
          lineType: item.lineType,
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
      setState({ kind: "ready", quote: updated });
      setLineItems(toDraftLineItems(updated));
    } catch (caught) {
      setSaveError(caught instanceof AdminApiError ? caught.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadAttachment() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setUploadingAttachment(true);
    setSaveError(null);
    try {
      const updated = await adminUploadQuoteAttachment(id, file);
      setState({ kind: "ready", quote: updated });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (caught) {
      setSaveError(caught instanceof AdminApiError ? caught.message : "Failed to upload attachment.");
    } finally {
      setUploadingAttachment(false);
    }
  }

  async function handleDeleteAttachment() {
    setSaveError(null);
    try {
      const updated = await adminDeleteQuoteAttachment(id);
      setState({ kind: "ready", quote: updated });
    } catch (caught) {
      setSaveError(caught instanceof AdminApiError ? caught.message : "Failed to remove attachment.");
    }
  }

  async function handleSend() {
    setSending(true);
    setSaveError(null);
    try {
      const updated = await adminSendQuote(id);
      setState({ kind: "ready", quote: updated });
    } catch (caught) {
      setSaveError(caught instanceof AdminApiError ? caught.message : "Failed to send quote.");
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(nextStatus: string) {
    setSaveError(null);
    try {
      const updated = await adminUpdateQuoteStatus(id, nextStatus);
      setState({ kind: "ready", quote: updated });
    } catch (caught) {
      setSaveError(caught instanceof AdminApiError ? caught.message : "Failed to update status.");
    }
  }

  if (state.kind === "loading") return <p className="text-sm text-muted">Loading…</p>;
  if (state.kind === "not-found") return <p className="text-sm text-muted">Quote not found.</p>;
  if (state.kind === "error") {
    return (
      <p className="rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
        {state.message}
      </p>
    );
  }

  const quote = state.quote;
  const grandTotal = lineItems.reduce((sum, item) => sum + lineTotal(item), 0);
  const nextStatuses = NEXT_STATUSES[quote.status] ?? [];

  return (
    <div>
      <Link href="/admin/quotes" className="incar-focus text-sm text-metallic-silver hover:text-white">
        ← Back to quotes
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 dir="ltr" className="text-2xl font-semibold text-white">{quote.publicReference}</h1>
          <p className="mt-1 text-sm text-muted">
            {quote.customerCompanyName} · {quote.customerContactName} · {quote.customerEmail}
          </p>
        </div>
        <span className="rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-sm font-semibold text-white">
          {quote.status}
        </span>
      </div>

      <div className="incar-card mt-6 grid gap-2 rounded-lg p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Currency</p>
          <p className="mt-1 text-white">{quote.currency}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Exchange rate (frozen)</p>
          <p dir="ltr" className="mt-1 text-white">{quote.exchangeRate}</p>
        </div>
      </div>

      {saveError ? (
        <p className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          {saveError}
        </p>
      ) : null}

      <div className="incar-card mt-6 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Line items</h2>
          {quote.status === "draft" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addProductLine}
                className="incar-focus rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-metallic-silver hover:text-white"
              >
                + Product line
              </button>
              <button
                type="button"
                onClick={addManualLine}
                className="incar-focus rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-metallic-silver hover:text-white"
              >
                + Manual line
              </button>
            </div>
          ) : null}
        </div>

        {lineItems.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No line items yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Description</th>
                  <th className="py-2 pr-3">Qty</th>
                  <th className="py-2 pr-3">Unit price</th>
                  <th className="py-2 pr-3">Total</th>
                  {quote.status === "draft" ? <th className="py-2" /> : null}
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.key} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pr-3 text-metallic-silver">{item.lineType}</td>
                    <td className="py-2 pr-3">
                      {quote.status === "draft" ? (
                        item.lineType === "product" ? (
                          <select
                            value={item.productId ?? ""}
                            onChange={(event) => {
                              const product = products.find((candidate) => candidate.id === event.target.value);
                              updateLine(item.key, {
                                productId: event.target.value,
                                description: product ? `${product.nameEn} (${product.partNumber})` : item.description,
                              });
                            }}
                            className="incar-input min-h-9 px-2 text-sm"
                          >
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.nameEn} ({product.partNumber})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            value={item.description}
                            onChange={(event) => updateLine(item.key, { description: event.target.value })}
                            className="incar-input min-h-9 w-full px-2 text-sm"
                          />
                        )
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      {quote.status === "draft" ? (
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) => updateLine(item.key, { quantity: Number(event.target.value) })}
                          className="incar-input min-h-9 w-20 px-2 text-sm"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      {quote.status === "draft" ? (
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(event) => updateLine(item.key, { unitPrice: Number(event.target.value) })}
                          className="incar-input min-h-9 w-24 px-2 text-sm"
                        />
                      ) : (
                        item.unitPrice.toFixed(2)
                      )}
                    </td>
                    <td dir="ltr" className="py-2 pr-3 text-white">
                      {lineTotal(item).toFixed(2)} {quote.currency}
                    </td>
                    {quote.status === "draft" ? (
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => removeLine(item.key)}
                          className="incar-focus rounded-md border border-border px-2 py-1 text-xs font-semibold text-metallic-silver hover:text-white"
                        >
                          Remove
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
            <p dir="ltr" className="mt-3 text-right text-sm font-semibold text-white">
              Grand total: {grandTotal.toFixed(2)} {quote.currency}
            </p>
          </div>
        )}
      </div>

      {quote.status === "draft" ? (
        <form onSubmit={handleSave} className="incar-card mt-6 grid gap-4 rounded-lg p-6">
          <label className="grid gap-2 text-sm font-semibold text-white">
            Internal notes
            <textarea
              value={internalNotes}
              onChange={(event) => setInternalNotes(event.target.value)}
              rows={3}
              className="incar-input px-4 py-3 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="incar-focus min-h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      ) : null}

      <div className="incar-card mt-6 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white">Attachment</h2>
        {quote.attachmentFilename ? (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-metallic-silver">{quote.attachmentFilename}</span>
            {quote.status === "draft" ? (
              <button
                type="button"
                onClick={handleDeleteAttachment}
                className="incar-focus rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-metallic-silver hover:text-white"
              >
                Remove
              </button>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">No attachment uploaded.</p>
        )}
        {quote.status === "draft" ? (
          <div className="mt-3 flex items-center gap-3">
            <input ref={fileInputRef} type="file" accept="application/pdf" className="text-sm text-metallic-silver" />
            <button
              type="button"
              onClick={handleUploadAttachment}
              disabled={uploadingAttachment}
              className="incar-focus min-h-9 rounded-md border border-border px-3 text-xs font-semibold text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingAttachment ? "Uploading…" : "Upload PDF"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {quote.status === "draft" ? (
          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="incar-focus min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send quote by email"}
          </button>
        ) : null}
        {nextStatuses.map((next) => (
          <button
            key={next}
            type="button"
            onClick={() => handleStatusChange(next)}
            className="incar-focus min-h-11 rounded-md border border-border px-5 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
          >
            Mark as {next}
          </button>
        ))}
      </div>
    </div>
  );
}
