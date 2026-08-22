"use client";

import { useRef, useState } from "react";
import {
  adminDeleteProductImage,
  adminReorderProductImages,
  adminUploadProductImage,
} from "@/features/admin/api/client";
import type { AdminProductImage } from "@/features/admin/api/contracts";

export function ProductImageManager({
  productId,
  images,
  onChange,
}: {
  productId: string;
  images: AdminProductImage[];
  onChange: (images: AdminProductImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const updated = await adminUploadProductImage(productId, file);
      onChange(updated);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    try {
      const updated = await adminReorderProductImages(
        productId,
        reordered.map((image) => image.id),
      );
      onChange(updated);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to reorder images.");
    }
  }

  async function removeImage(imageId: string) {
    try {
      const updated = await adminDeleteProductImage(productId, imageId);
      onChange(updated);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to delete image.");
    }
  }

  return (
    <div className="incar-card grid gap-4 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Images</h2>
        <label className="incar-focus cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-metallic-silver hover:text-white">
          {uploading ? "Uploading…" : "+ Upload image"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-xs text-muted">
        First image is the primary one shown on the storefront gallery. JPEG, PNG, or WebP, up to 8 MiB.
      </p>

      {error ? (
        <p role="alert" className="rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
          {error}
        </p>
      ) : null}

      {images.length === 0 ? <p className="text-sm text-muted">No images uploaded yet.</p> : null}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.id} className="grid gap-2">
              <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-surface-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview thumbnail, not a public page */}
                <img src={image.url} alt={image.altEn ?? image.altAr ?? ""} className="h-full w-full object-cover" />
                {index === 0 ? (
                  <span className="absolute left-1 top-1 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Primary
                  </span>
                ) : null}
              </div>
              <div className="flex justify-between gap-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    aria-label="Move earlier"
                    className="incar-focus inline-flex size-7 items-center justify-center rounded-md border border-border text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label="Move later"
                    className="incar-focus inline-flex size-7 items-center justify-center rounded-md border border-border text-metallic-silver hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="incar-focus rounded-md border border-border px-2 text-xs font-semibold text-metallic-silver hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
