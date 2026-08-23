"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImage } from "./ProductImage";

export type GalleryImage = {
  src: string;
  alt: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  brand: string;
  partNumber: string;
  noImageLabel?: string;
};

export function ProductGallery({
  images,
  brand,
  partNumber,
  noImageLabel = "Image unavailable",
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const active = images[selectedIndex] ?? images[0];

  return (
    <div className="grid gap-3">
      <ProductImage
        key={active?.src}
        src={active?.src ?? null}
        alt={active?.alt ?? partNumber}
        brand={brand}
        partNumber={partNumber}
        noImageLabel={noImageLabel}
        priority
      />

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
              className={`incar-focus relative size-16 shrink-0 overflow-hidden rounded-md border transition ${
                index === selectedIndex
                  ? "border-primary"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="64px"
                className="object-cover grayscale contrast-110"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
