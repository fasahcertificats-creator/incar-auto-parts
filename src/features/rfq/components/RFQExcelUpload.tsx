"use client";

import type { ChangeEvent } from "react";
import { useRef } from "react";
import {
  RFQ_ALLOWED_FILE_EXTENSIONS,
  RFQ_ALLOWED_MIME_TYPES,
  RFQ_MAX_FILE_SIZE_BYTES,
  RFQ_MAX_FILE_SIZE_MB,
} from "@/config/upload";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import type { UploadedRFQFileMeta } from "@/types/upload";

type RFQExcelUploadProps = {
  value: UploadedRFQFileMeta | null;
  error: string;
  onChange: (fileMeta: UploadedRFQFileMeta | null) => void;
  onErrorChange: (error: string) => void;
};

const acceptedFormats = "XLSX, XLS, CSV";
const acceptedExtensions = RFQ_ALLOWED_FILE_EXTENSIONS.join(",");

function getFileExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileMeta(file: File): UploadedRFQFileMeta {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension: getFileExtension(file.name),
    lastModified: file.lastModified,
  };
}

export function RFQExcelUpload({
  value,
  error,
  onChange,
  onErrorChange,
}: RFQExcelUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  function clearSelectedFile() {
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
    onErrorChange("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      onChange(null);
      onErrorChange("");
      return;
    }

    const fileMeta = getFileMeta(file);
    const hasAllowedExtension = RFQ_ALLOWED_FILE_EXTENSIONS.includes(
      fileMeta.extension as (typeof RFQ_ALLOWED_FILE_EXTENSIONS)[number],
    );

    if (!hasAllowedExtension) {
      onChange(null);
      onErrorChange(dictionary.forms.upload.typeError);
      return;
    }

    if (fileMeta.size > RFQ_MAX_FILE_SIZE_BYTES) {
      onChange(null);
      onErrorChange(dictionary.forms.upload.sizeError);
      return;
    }

    // Frontend mock only: the file is not uploaded or parsed here. Only safe
    // metadata is captured; a future backend must revalidate type and size,
    // scan uploads, and validate files again before storage.
    onChange(fileMeta);
    onErrorChange("");
  }

  return (
    <div className="md:col-span-2">
      <label className="grid gap-3 text-sm font-semibold text-white">
        {dictionary.forms.upload.label}
        <span className="text-sm font-normal leading-6 text-muted">
          {dictionary.forms.upload.description}
        </span>
        <input
          ref={inputRef}
          className="rounded-md border border-dashed border-metallic-silver/24 bg-background px-4 py-4 text-sm text-metallic-silver file:me-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-metallic-silver/45"
          name="excelFile"
          type="file"
          accept={acceptedExtensions}
          onChange={handleFileChange}
        />
      </label>

      <div className="mt-3 grid gap-3 rounded-md border border-border bg-background p-4 text-sm text-muted">
        <div className="grid gap-1 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-metallic-silver">{dictionary.forms.upload.accepted}</span>{" "}
            {acceptedFormats}
          </p>
          <p>
            <span className="font-semibold text-metallic-silver">{dictionary.forms.upload.maxSize}</span>{" "}
            {RFQ_MAX_FILE_SIZE_MB} MB
          </p>
        </div>
        <div>
          <p className="font-semibold text-metallic-silver">
            {dictionary.forms.upload.columnsTitle}
          </p>
          <p className="mt-1">
            {dictionary.forms.upload.columns}
          </p>
        </div>
        {value ? (
          <div className="flex flex-col justify-between gap-3 rounded-md border border-metallic-silver/24 p-3 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-white">{value.name}</p>
              <p className="mt-1 text-xs text-metallic-silver">
                {formatFileSize(value.size)} | {value.extension.toUpperCase()} |{" "}
                {value.type || dictionary.forms.upload.mimeFallback}
              </p>
            </div>
            <button
              type="button"
              onClick={clearSelectedFile}
              className="incar-focus min-h-10 rounded-md border border-border px-3 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
            >
              {dictionary.forms.upload.remove}
            </button>
          </div>
        ) : null}
        {error ? (
          <p className="rounded-md border border-primary/30 bg-primary/10 p-3 font-semibold text-white">
            {error}
          </p>
        ) : null}
        <p className="text-xs leading-5 text-muted">
          {dictionary.forms.upload.note} {dictionary.forms.upload.mimeTypes}{" "}
          {RFQ_ALLOWED_MIME_TYPES.join(", ")}.
        </p>
      </div>
    </div>
  );
}
