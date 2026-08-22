"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AdminApiError,
  adminGetProduct,
  adminListCategories,
  adminUpdateProduct,
} from "@/features/admin/api/client";
import type {
  AdminCategory,
  AdminProductDetail,
  AdminProductInput,
} from "@/features/admin/api/contracts";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { ProductImageManager } from "@/features/admin/components/ProductImageManager";

type DetailState =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error"; message: string }
  | { kind: "ready"; product: AdminProductDetail; categories: AdminCategory[] };

export default function AdminProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [state, setState] = useState<DetailState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    Promise.all([adminGetProduct(id), adminListCategories()])
      .then(([product, categories]) => {
        if (!cancelled) setState({ kind: "ready", product, categories });
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
          message: caught instanceof AdminApiError ? caught.message : "Failed to load product.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (state.kind === "loading") return <p className="text-sm text-muted">Loading…</p>;
  if (state.kind === "not-found") return <p className="text-sm text-muted">Product not found.</p>;
  if (state.kind === "error") {
    return (
      <p className="rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
        {state.message}
      </p>
    );
  }

  async function handleSubmit(input: AdminProductInput) {
    const updated = await adminUpdateProduct(id, input);
    setState((current) => (current.kind === "ready" ? { ...current, product: updated } : current));
  }

  const { product, categories } = state;

  return (
    <div>
      <Link href="/admin/products" className="incar-focus text-sm text-metallic-silver hover:text-white">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-white">{product.nameEn}</h1>
      <p className="mt-1 text-sm text-muted" dir="ltr">{product.partNumber}</p>

      <div className="mt-6">
        <ProductImageManager
          productId={id}
          images={product.images}
          onChange={(images) =>
            setState((current) =>
              current.kind === "ready" ? { ...current, product: { ...current.product, images } } : current,
            )
          }
        />
      </div>

      <div className="mt-6">
        <ProductForm
          initial={product}
          categories={categories}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
