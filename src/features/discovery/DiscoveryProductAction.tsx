"use client";

import { useState } from "react";
import { AddToRfqButton } from "@/components/AddToRfqButton";
import { useCart } from "@/features/cart/cart-context";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import type { Product, ReferenceMatch } from "@/types/product";

type ProductPricing = { directSalePriceUsd: string; availableForInstantPurchase: true } | null;

export function DiscoveryProductAction({
  product,
  referenceMatch,
  vehicleContext,
  pricing = null,
}: {
  product: Product;
  referenceMatch?: Exclude<ReferenceMatch, "none">;
  vehicleContext?: { makeId: string; modelId?: string };
  pricing?: ProductPricing;
}) {
  const contextualRelationship = vehicleContext?.modelId
    ? product.vehicleRelationships.find(
        (relationship) =>
          relationship.makeId === vehicleContext.makeId &&
          relationship.modelId === vehicleContext.modelId,
      )
    : undefined;
  const compatibilityVerified = contextualRelationship
    ? contextualRelationship.compatibilityStatus === "verified"
    : product.compatibilityStatus === "verified";
  const canAddToDraft =
    referenceMatch === "exact" &&
    product.requestEligibility === "requestable" &&
    compatibilityVerified &&
    !product.hasCriticalDataConflict;

  const rfqAction = canAddToDraft ? <AddToRfqButton product={product} compact /> : null;
  const purchaseAction = pricing?.availableForInstantPurchase ? (
    <BuyBlock product={product} directSalePriceUsd={pricing.directSalePriceUsd} />
  ) : null;

  if (!rfqAction && !purchaseAction) return null;

  return (
    <div className="grid gap-4">
      {purchaseAction}
      {rfqAction}
    </div>
  );
}

function BuyBlock({ product, directSalePriceUsd }: { product: Product; directSalePriceUsd: string }) {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.cart.buyBlock;
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        productId: product.internalProductId,
        slug: product.slug,
        nameAr: product.name.ar,
        nameEn: product.name.en,
        partNumber: product.references.incarPartNumber ?? product.references.oemReferences[0] ?? "",
        unitPriceUsd: directSalePriceUsd,
      },
      quantity,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="rounded-md border border-border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{copy.priceLabel}</p>
      <p dir="ltr" className="mt-1 text-2xl font-bold text-white">
        ${Number(directSalePriceUsd).toFixed(2)} <span className="text-sm font-medium text-muted">USD</span>
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-white">
          {copy.quantityLabel}
          <input
            type="number"
            min={1}
            max={999999}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Math.min(999_999, Math.floor(Number(event.target.value) || 1))))}
            className="incar-input min-h-10 w-20 px-3 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] transition hover:bg-primary-hover"
        >
          {added ? copy.added : copy.addToCart}
        </button>
      </div>
    </div>
  );
}
