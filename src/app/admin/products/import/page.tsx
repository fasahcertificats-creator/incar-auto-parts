"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { adminBulkImportProducts } from "@/features/admin/api/client";
import type { AdminProductBulkImportSummary } from "@/features/admin/api/contracts";

const TEMPLATE_HEADER =
  "slug,partNumber,nameAr,nameEn,descriptionAr,descriptionEn,categorySlug,oemReferences,verifiedAlternateReferences,compatibilityStatus,requestEligibility,requestEligibilityNotes,dataVerificationState,status,referencePriceUsd,referencePriceCny,directSalePriceUsd,directSalePriceCny,availableForInstantPurchase\n";
const TEMPLATE_EXAMPLE =
  'toyota-camry-brake-pad,INC-BP-1001,وسادة فرامل تويوتا كامري,Toyota Camry Brake Pad,,,brake-system,OEM-1001;OEM-1002,,verified,requestable,,verified,draft,12.50,89.00,,,false\n';

export default function AdminProductsImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AdminProductBulkImportSummary | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleImport() {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await adminBulkImportProducts(file);
      setSummary(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Import failed.");
    } finally {
      setUploading(false);
    }
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_HEADER, TEMPLATE_EXAMPLE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <Link href="/admin/products" className="incar-focus text-sm text-metallic-silver hover:text-white">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-white">Bulk import products</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        CSV only, up to 5,000 rows. Vehicle compatibility and images aren&apos;t part of the import —
        add those on each product&apos;s page afterward. Rows are validated and created one at a time;
        a failing row doesn&apos;t block the others.
      </p>

      <button
        type="button"
        onClick={downloadTemplate}
        className="incar-focus mt-4 min-h-10 rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
      >
        Download CSV template
      </button>

      <div className="incar-card mt-6 grid max-w-xl gap-4 rounded-lg p-6">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="text-sm text-metallic-silver"
        />
        <button
          type="button"
          onClick={handleImport}
          disabled={!file || uploading}
          className="incar-focus min-h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Importing…" : "Import"}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          {error}
        </p>
      ) : null}

      {summary ? (
        <div className="mt-6">
          <p className="text-sm font-semibold text-white">
            {summary.created} created, {summary.failed} failed, out of {summary.totalRows} rows.
          </p>
          <div className="incar-card mt-4 overflow-x-auto rounded-lg">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-3">Row</th>
                  <th className="px-4 py-3">Part number</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {summary.results.map((result) => (
                  <tr key={result.row} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 text-metallic-silver">{result.row}</td>
                    <td className="px-4 py-3 text-metallic-silver" dir="ltr">{result.partNumber ?? "—"}</td>
                    <td className="px-4 py-3">
                      {result.status === "created" ? (
                        <Link
                          href={`/admin/products/${result.productId}`}
                          className="incar-focus font-semibold text-success hover:underline"
                        >
                          Created
                        </Link>
                      ) : (
                        <span className="text-primary">{result.errors?.join("; ")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
