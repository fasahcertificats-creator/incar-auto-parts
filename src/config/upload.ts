export const RFQ_ALLOWED_FILE_EXTENSIONS = [".xlsx", ".xls", ".csv"] as const;

export const RFQ_ALLOWED_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
  "text/plain",
] as const;

export const RFQ_MAX_FILE_SIZE_MB = 10;
export const RFQ_MAX_FILE_SIZE_BYTES = RFQ_MAX_FILE_SIZE_MB * 1024 * 1024;

