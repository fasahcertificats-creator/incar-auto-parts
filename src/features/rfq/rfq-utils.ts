import type { Product } from "@/types";
import { getMakeById, getModelById } from "@/features/discovery/repository";
import type { RFQFormData, RFQItem, RFQSubmission } from "@/types/rfq";

export function productToRFQItem(product: Product, quantity = 1): RFQItem {
  const relationship = product.vehicleRelationships[0];
  const make = relationship ? getMakeById(relationship.makeId) : undefined;
  const model = relationship ? getModelById(relationship.modelId) : undefined;

  return {
    productId: product.internalProductId,
    productName: product.name.en,
    slug: product.slug,
    brand: make?.name ?? "INCAR",
    vehicleModel: model?.name ?? "",
    category: product.category,
    partNumber: product.references.incarPartNumber ?? "",
    oemNumber: product.references.oemReferences[0] ?? "",
    quantity: Math.max(1, quantity),
  };
}

export const createRFQItem = productToRFQItem;

export function sanitizeQuantity(quantity: number) {
  return Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
}

export function createRFQSubmission(
  formData: RFQFormData,
  items: RFQItem[],
): RFQSubmission {
  const fileMeta = formData.excelFile;

  return {
    customer: {
      fullName: formData.fullName.trim(),
      companyName: formData.companyName.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      email: formData.email.trim(),
      whatsapp: formData.whatsapp.trim(),
    },
    items,
    interestedProductsText: formData.interestedProductsText.trim(),
    requestedQuantityText: formData.requestedQuantityText.trim(),
    message: formData.message.trim(),
    excelFile: fileMeta,
    fileName: fileMeta?.name ?? "",
    fileSize: fileMeta?.size ?? 0,
    fileType: fileMeta?.type ?? "",
    fileExtension: fileMeta?.extension ?? "",
    lastModified: fileMeta?.lastModified ?? null,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
}
