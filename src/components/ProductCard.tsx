import Link from "next/link";
import type { Product } from "@/types/product";
import { AddToRfqButton } from "./AddToRfqButton";
import { ProductImage } from "./ProductImage";

function formatFitment(product: Product) {
  return product.compatibility
    .slice(0, 2)
    .map((fitment) =>
      fitment.yearFrom && fitment.yearTo
        ? `${fitment.model} ${fitment.yearFrom}-${fitment.yearTo}`
        : `${fitment.model} review required`,
    )
    .join(", ");
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="incar-card group flex h-full flex-col overflow-hidden rounded-lg transition hover:-translate-y-1 hover:border-metallic-silver/35">
      <Link href={`/products/${product.slug}`} className="incar-focus block rounded-md">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          brand={product.brand}
          partNumber={product.partNumber}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-sm bg-surface-elevated px-2.5 py-1 text-metallic-silver">
            {product.brand}
          </span>
          <span className="rounded-sm bg-surface-elevated px-2.5 py-1 text-metallic-silver">
            {product.vehicleModel}
          </span>
          <span className="rounded-sm border border-primary/24 bg-primary/10 px-2.5 py-1 text-metallic-silver">
            {product.category}
          </span>
        </div>
        <Link href={`/products/${product.slug}`} className="incar-focus block rounded-sm">
          <h3 className="text-xl font-semibold text-white group-hover:text-metallic-silver">
            {product.name}
          </h3>
        </Link>
        <dl className="mt-4 grid gap-2 text-sm text-muted">
          <div className="flex justify-between gap-4">
            <dt>Part number</dt>
            <dd className="font-semibold text-white">{product.partNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>OEM</dt>
            <dd className="font-semibold text-white">{product.oemNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>MOQ</dt>
            <dd className="font-semibold text-white">{product.moq} pcs</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Origin</dt>
            <dd className="font-semibold text-white">{product.origin}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Private Label</dt>
            <dd className="font-semibold text-white">
              {product.privateLabelAvailable ? "Available" : "By review"}
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex-1">
          <p className="text-sm leading-6 text-muted">
            Compatible with {formatFitment(product)}.
          </p>
        </div>
        <div className="mt-5">
          <AddToRfqButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
