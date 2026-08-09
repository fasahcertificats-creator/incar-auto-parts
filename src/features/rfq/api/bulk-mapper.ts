import type { Locale } from "@/i18n/types";
import type {
  BulkInspectionResponse,
  BulkListMetadata,
  BulkMappingPayload,
  BulkTargetField,
  BulkUploadDraft,
} from "./contracts.ts";

export const BULK_MAX_FILE_BYTES = 25 * 1024 * 1024;
export const BULK_EXTENSIONS = [".csv", ".xlsx"] as const;

export type BulkUploadValidationCode =
  | "file-required" | "file-type" | "file-size" | "contact-name" | "company-name"
  | "country-code" | "email" | "privacy";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const countryPattern = /^[A-Za-z]{2}$/u;

export function fileExtension(name: string) {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot).toLowerCase();
}

export function validateBulkUpload(draft: BulkUploadDraft, file: File | null) {
  const errors: BulkUploadValidationCode[] = [];
  if (!file) errors.push("file-required");
  else {
    if (!BULK_EXTENSIONS.includes(fileExtension(file.name) as (typeof BULK_EXTENSIONS)[number])) errors.push("file-type");
    if (file.size < 1 || file.size > BULK_MAX_FILE_BYTES) errors.push("file-size");
  }
  if (!draft.contactName.trim()) errors.push("contact-name");
  if (!draft.companyName.trim()) errors.push("company-name");
  if (!countryPattern.test(draft.countryCode.trim())) errors.push("country-code");
  if (!emailPattern.test(draft.email.trim())) errors.push("email");
  if (!draft.privacyConsent) errors.push("privacy");
  return errors;
}

export function mapBulkMetadata(locale: Locale, draft: BulkUploadDraft): BulkListMetadata {
  const countryCode = draft.countryCode.trim().toUpperCase();
  return {
    requestType: "bulk-list",
    requestIntent: null,
    locale,
    marketCountryCode: countryCode,
    ...(draft.customerNotes.trim() ? { customerNotes: draft.customerNotes.trim() } : {}),
    contact: {
      companyName: draft.companyName.trim(),
      contactName: draft.contactName.trim(),
      countryCode,
      ...(draft.city.trim() ? { city: draft.city.trim() } : {}),
      ...(draft.businessType ? { businessType: draft.businessType } : {}),
      email: draft.email.trim(),
      ...(draft.phone.trim() ? { phone: draft.phone.trim() } : {}),
      ...(draft.whatsapp.trim() ? { whatsapp: draft.whatsapp.trim() } : {}),
      preferredLocale: locale,
    },
    privacyConsent: { accepted: true },
  };
}

export function bulkAttemptFingerprint(metadata: BulkListMetadata, file: File) {
  return JSON.stringify({ metadata, file: { name: file.name, size: file.size, type: file.type, lastModified: file.lastModified } });
}

export type BulkAttempt = { fingerprint: string; idempotencyKey: string };
export function resolveBulkAttempt(
  previous: BulkAttempt | null,
  fingerprint: string,
  uuid: () => string = () => crypto.randomUUID(),
): BulkAttempt {
  return previous?.fingerprint === fingerprint ? previous : { fingerprint, idempotencyKey: uuid() };
}

export function makeBulkFormData(metadata: BulkListMetadata, file: File) {
  const body = new FormData();
  body.append("metadata", JSON.stringify(metadata));
  body.append("file", file);
  return body;
}

export function buildBulkMapping(
  inspection: BulkInspectionResponse,
  selections: Record<number, BulkTargetField | "">,
): BulkMappingPayload {
  return {
    version: 1,
    sourceSheetIndex: inspection.selectedSheet.index,
    headerRowNumber: inspection.headerRowNumber,
    columns: inspection.headers.flatMap((header) => {
      const targetField = selections[header.index];
      return targetField ? [{ sourceColumn: header.display, targetField }] : [];
    }),
  };
}

export function validateBulkMapping(payload: BulkMappingPayload) {
  const targets = payload.columns.map((column) => column.targetField);
  const duplicate = new Set(targets).size !== targets.length;
  const useful = targets.some((target) => ["partNumber", "oemReference", "description"].includes(target));
  return { valid: payload.columns.length > 0 && !duplicate && useful, duplicate, useful };
}

export const isBulkTerminal = (status: string) =>
  ["completed", "completed-with-errors", "failed", "cancelled"].includes(status);

export function nextPollDelay(seconds: number | null, hidden: boolean) {
  const base = (seconds ?? 3) * 1_000;
  return hidden ? Math.max(base, 15_000) : base;
}
