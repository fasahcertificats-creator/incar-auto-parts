"use client";

import { AddToRfqButton } from "@/components/AddToRfqButton";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import type { Product, ReferenceMatch } from "@/types/product";

export function DiscoveryProductAction({
  product,
  referenceMatch,
  vehicleContext,
}: {
  product: Product;
  referenceMatch?: Exclude<ReferenceMatch, "none">;
  vehicleContext?: { makeId: string; modelId?: string };
}) {
  const { locale } = useLocale();
  const copy = getDictionary(locale).discovery.search;
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

  if (canAddToDraft) {
    return <AddToRfqButton product={product} compact />;
  }

  if (referenceMatch === "possible") {
    return null;
  }

  const label =
    product.requestEligibility === "verification-required" ||
    product.compatibilityStatus === "requires-confirmation" ||
    product.compatibilityStatus === "not-verified"
      ? copy.requestVerification
      : copy.verificationUnavailable;

  return (
    <div>
      <button
        type="button"
        disabled
        className="min-h-11 w-full cursor-not-allowed rounded-md border border-border px-4 text-sm font-semibold text-muted"
      >
        {label}
      </button>
      <p className="mt-2 text-xs leading-5 text-muted">{copy.verificationUnavailable}</p>
    </div>
  );
}
