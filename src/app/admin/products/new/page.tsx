"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminApiError, adminCreateProduct, adminListCategories } from "@/features/admin/api/client";
import type { AdminCategory, AdminProductInput } from "@/features/admin/api/contracts";
import { ProductForm } from "@/features/admin/components/ProductForm";

export default function AdminProductCreatePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    adminListCategories()
      .then(setCategories)
      .catch((caught: unknown) => {
        if (caught instanceof AdminApiError && caught.status === 401) {
          router.push("/admin/login");
          return;
        }
        setLoadError(caught instanceof AdminApiError ? caught.message : "Failed to load categories.");
      });
  }, [router]);

  async function handleSubmit(input: AdminProductInput) {
    const product = await adminCreateProduct(input);
    router.push(`/admin/products/${product.id}`);
  }

  return (
    <div>
      <Link href="/admin/products" className="incar-focus text-sm text-metallic-silver hover:text-white">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-white">Add product</h1>
      <p className="mt-1 text-sm text-muted">Image upload is available after the product is created.</p>

      {loadError ? (
        <p className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          {loadError}
        </p>
      ) : null}
      {categories === null && !loadError ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}
      {categories && categories.length === 0 ? (
        <p className="mt-6 rounded-md border border-primary/35 bg-primary/10 p-4 text-sm text-soft-silver">
          Create at least one category before adding products.
        </p>
      ) : null}

      {categories && categories.length > 0 ? (
        <div className="mt-6">
          <ProductForm categories={categories} submitLabel="Create product" onSubmit={handleSubmit} />
        </div>
      ) : null}
    </div>
  );
}
