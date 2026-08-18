import type {
  BulkInspectionResponse,
  BulkListMetadata,
  BulkMappingPayload,
  BulkMappingResponse,
  BulkStatusResponse,
  BulkSubmissionResponse,
  ProductRfqPayload,
  RfqReceiptResponse,
  RfqSubmissionResponse,
} from "./contracts.ts";
import { makeBulkFormData } from "./bulk-mapper.ts";
import { mapRfqError, RfqApiError } from "./errors.ts";

type FetchImplementation = typeof fetch;
type ClientOptions = { baseUrl?: string; fetchImpl?: FetchImplementation; signal?: AbortSignal };

function getApiBaseUrl(override?: string) {
  const configured = override ?? process.env.NEXT_PUBLIC_INCAR_API_BASE_URL;
  const normalized = configured?.trim().replace(/\/+$/u, "");
  return normalized ?? "";
}
async function readErrorCode(response: Response): Promise<string | null> {
  try {
    const body = (await response.json()) as { error?: { code?: unknown } };
    return typeof body.error?.code === "string" ? body.error.code : null;
  } catch {
    return null;
  }
}

function isSubmissionResponse(value: unknown): value is RfqSubmissionResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  return typeof response.publicReference === "string" &&
    response.requestType === "product-rfq" &&
    (response.requestIntent === null || response.requestIntent === "compatibility-verification") &&
    typeof response.status === "string" && typeof response.submittedAt === "string";
}

async function requestJson<T>(
  url: string,
  init: RequestInit,
  fetchImpl: FetchImplementation,
  validate: (value: unknown) => value is T,
): Promise<T> {
  let response: Response;
  try {
    response = await fetchImpl(url, init);
  } catch {
    throw new RfqApiError("network", null, null);
  }
  if (!response.ok) {
    throw mapRfqError(
      response.status,
      await readErrorCode(response),
      response.headers.get("Retry-After"),
    );
  }
  try {
    const value: unknown = await response.json();
    if (!validate(value)) throw new Error("Invalid response shape");
    return value;
  } catch {
    throw new RfqApiError("server", response.status, "RFQ_RESPONSE_INVALID");
  }
}

const object = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object";
const fileStatuses = new Set(["uploaded", "awaiting-mapping", "queued", "processing", "completed", "completed-with-errors", "failed", "cancelled"]);
const bulkTargetFields = new Set(["partNumber", "oemReference", "description", "quantity", "unit", "make", "model", "year", "engine", "vin", "frameNumber", "notes"]);
const isFileStatus = (value: unknown) => typeof value === "string" && fileStatuses.has(value);

function isBulkSubmission(value: unknown): value is BulkSubmissionResponse {
  return object(value) && typeof value.publicReference === "string" && value.requestType === "bulk-list" &&
    value.requestIntent === null && value.status === "submitted" && typeof value.submittedAt === "string";
}

function isBulkInspection(value: unknown): value is BulkInspectionResponse {
  if (!object(value) || typeof value.publicReference !== "string" || value.requestType !== "bulk-list" ||
    !isFileStatus(value.fileStatus) || (value.format !== "csv" && value.format !== "xlsx") ||
    !Array.isArray(value.sheets) || !object(value.selectedSheet) || !Array.isArray(value.headers) ||
    !Number.isInteger(value.headerRowNumber) || !object(value.mappingRequirements)) return false;
  return value.sheets.every((sheet) => object(sheet) && Number.isInteger(sheet.index) &&
      (sheet.name === null || typeof sheet.name === "string") && ["visible", "hidden", "veryHidden"].includes(String(sheet.state))) &&
    value.headers.every((header) => object(header) && Number.isInteger(header.index) && typeof header.display === "string") &&
    value.mappingRequirements.version === 1 && Array.isArray(value.mappingRequirements.targetFields) &&
    value.mappingRequirements.targetFields.every((field) => typeof field === "string" && bulkTargetFields.has(field)) &&
    Array.isArray(value.mappingRequirements.identificationFields) && typeof value.mappingRequirements.readOnly === "boolean";
}

function isBulkMapping(value: unknown): value is BulkMappingResponse {
  return object(value) && typeof value.publicReference === "string" && isFileStatus(value.fileStatus) && value.mappingAccepted === true;
}

function isBulkStatus(value: unknown): value is BulkStatusResponse {
  if (!object(value) || typeof value.publicReference !== "string" || typeof value.requestStatus !== "string" ||
    !isFileStatus(value.fileStatus) || value.processingScope !== "parsed-and-validated" || !object(value.summary)) return false;
  const summary = value.summary;
  return ["totalRows", "validRows", "invalidRows", "processingErrorRows"].every((key) => Number.isInteger(summary[key])) &&
    (value.pollAfterSeconds === 3 || value.pollAfterSeconds === null);
}

export function submitProductRfq(
  payload: ProductRfqPayload,
  idempotencyKey: string,
  options: ClientOptions = {},
) {
  return requestJson<RfqSubmissionResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/rfqs/product`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    },
    options.fetchImpl ?? fetch,
    isSubmissionResponse,
  );
}

export function getRfqReceipt(options: ClientOptions = {}) {
  return requestJson<RfqReceiptResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/rfqs/receipt`,
    { method: "GET", credentials: "include", cache: "no-store" },
    options.fetchImpl ?? fetch,
    (value): value is RfqReceiptResponse => {
      if (!isSubmissionResponse(value)) return false;
      const locale = (value as { locale?: unknown }).locale;
      return locale === "ar" || locale === "en";
    },
  );
}

export function submitBulkList(
  metadata: BulkListMetadata,
  file: File,
  idempotencyKey: string,
  options: ClientOptions = {},
) {
  return requestJson<BulkSubmissionResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/rfqs/bulk-list`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Idempotency-Key": idempotencyKey },
      body: makeBulkFormData(metadata, file),
      signal: options.signal,
    },
    options.fetchImpl ?? fetch,
    isBulkSubmission,
  );
}

export function getBulkInspection(
  selection: { sourceSheetIndex?: number; headerRowNumber?: number } = {},
  options: ClientOptions = {},
) {
  const query = new URLSearchParams();
  if (selection.sourceSheetIndex !== undefined) query.set("sourceSheetIndex", String(selection.sourceSheetIndex));
  if (selection.headerRowNumber !== undefined) query.set("headerRowNumber", String(selection.headerRowNumber));
  const suffix = query.size ? `?${query}` : "";
  return requestJson<BulkInspectionResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/rfqs/bulk-list/inspection${suffix}`,
    { method: "GET", credentials: "include", cache: "no-store", signal: options.signal },
    options.fetchImpl ?? fetch,
    isBulkInspection,
  );
}

export function submitBulkMapping(payload: BulkMappingPayload, options: ClientOptions = {}) {
  return requestJson<BulkMappingResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/rfqs/bulk-list/mapping`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: options.signal,
    },
    options.fetchImpl ?? fetch,
    isBulkMapping,
  );
}

export function getBulkStatus(options: ClientOptions = {}) {
  return requestJson<BulkStatusResponse>(
    `${getApiBaseUrl(options.baseUrl)}/v1/rfqs/bulk-list/status`,
    { method: "GET", credentials: "include", cache: "no-store", signal: options.signal },
    options.fetchImpl ?? fetch,
    isBulkStatus,
  );
}
