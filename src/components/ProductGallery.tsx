"use client";

import Image from "next/image";
import { useState } from "react";

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
      <div
        role={active ? undefined : "img"}
        aria-label={active ? undefined : `${noImageLabel}: ${partNumber}`}
        className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-surface-elevated"
      >
        {active ? (
          <Image
            key={active.src}
            src={active.src}
            alt={active.alt}
            fill
            sizes="(min-width: 1024px) 30vw, 90vw"
            className="object-cover opacity-[0.88] grayscale contrast-110"
            priority
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm font-semibold text-muted">
            {noImageLabel}
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(7,7,7,0.12),rgba(7,7,7,0.46))]" />
        <div className="absolute start-4 top-4 rounded-sm border border-metallic-silver/20 bg-background/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          {brand}
        </div>
        <div
          dir="ltr"
          className="absolute bottom-4 end-4 rounded-sm bg-soft-silver px-3 py-1 text-[11px] font-semibold text-ink shadow-sm"
        >
          {partNumber}
        </div>
        <div className="pointer-events-none absolute inset-0 flex rotate-[-22deg] items-center justify-center text-3xl font-black uppercase tracking-[0.32em] text-white/[0.06]">
          INCAR / RFQ
        </div>
      </div>

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
