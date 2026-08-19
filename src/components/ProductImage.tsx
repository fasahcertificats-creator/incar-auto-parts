import Image from "next/image";

type ProductImageProps = {
  src: string | null;
  alt: string;
  brand: string;
  partNumber: string;
  noImageLabel?: string;
};

export function ProductImage({
  src,
  alt,
  brand,
  partNumber,
  noImageLabel = "Image unavailable",
}: ProductImageProps) {
  return (
    <div
      role={src ? undefined : "img"}
      aria-label={src ? undefined : `${noImageLabel}: ${alt}`}
      className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-surface-elevated"
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="object-cover opacity-[0.88] grayscale contrast-110"
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
      <div dir="ltr" className="absolute bottom-4 end-4 rounded-sm bg-soft-silver px-3 py-1 text-[11px] font-semibold text-ink shadow-sm">
        {partNumber}
      </div>
      <div className="pointer-events-none absolute inset-0 flex rotate-[-22deg] items-center justify-center text-3xl font-black uppercase tracking-[0.32em] text-white/[0.06]">
        INCAR / RFQ
      </div>
    </div>
  );
}
