import type { Product } from "@/types";
import type { RFQItem } from "@/types/rfq";

export function productToRFQItem(product: Product, quantity = 1): RFQItem {
  const relationship = product.vehicleRelationships[0];

  return {
    productId: product.internalProductId,
    productName: product.name.en,
    slug: product.slug,
    brand: relationship?.makeName ?? "INCAR",
    vehicleModel: relationship?.modelName ?? "",
    category: product.category,
    partNumber: product.references.incarPartNumber ?? "",
    oemNumber: product.references.oemReferences[0] ?? "",
    quantity: Math.max(1, quantity),
  };
}

export const createRFQItem = productToRFQItem;

export function sanitizeQuantity(quantity: number) {
  return Number.isFinite(quantity)
    ? Math.min(999_999, Math.max(1, Math.floor(quantity)))
    : 1;
}
