"use client";

import { AddToRfqButton } from "@/components/AddToRfqButton";
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

  return null;
}
