"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import {
  bulkAttemptFingerprint,
  buildBulkMapping,
  BULK_EXTENSIONS,
  isBulkTerminal,
  mapBulkMetadata,
  nextPollDelay,
  resolveBulkAttempt,
  validateBulkMapping,
  validateBulkUpload,
  type BulkAttempt,
  type BulkUploadValidationCode,
} from "../api/bulk-mapper";
import { getBulkInspection, getBulkStatus, submitBulkList, submitBulkMapping } from "../api/client";
import type {
  BulkFileStatus,
  BulkInspectionResponse,
  BulkStatusResponse,
  BulkTargetField,
  BulkUploadDraft,
} from "../api/contracts";
import { RfqApiError } from "../api/errors";

type Phase = "recovering" | "upload" | "inspection" | "status";
const businessValues = ["", "importer", "wholesaler", "distributor", "workshop", "retailer", "other"] as const;
const targetValues: BulkTargetField[] = [
  "partNumber", "oemReference", "description", "quantity", "unit", "make",
  "model", "year", "engine", "vin", "frameNumber", "notes",
];
const initialDraft: BulkUploadDraft = {
  companyName: "", contactName: "", countryCode: "", city: "", businessType: "",
  email: "", phone: "", whatsapp: "", customerNotes: "", privacyConsent: false,
};

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KiB` : `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
}

export function BulkListJourney() {
  const { locale } = useLocale();
  const copy = getDictionary(locale).pages.bulkList;
  const [phase, setPhase] = useState<Phase>("recovering");
  const [draft, setDraft] = useState<BulkUploadDraft>(initialDraft);
  const [file, setFile] = useState<File | null>(null);
  const [inspection, setInspection] = useState<BulkInspectionResponse | null>(null);
  const [status, setStatus] = useState<BulkStatusResponse | null>(null);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [headerRow, setHeaderRow] = useState(1);
  const [selections, setSelections] = useState<Record<number, BulkTargetField | "">>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [receiptLost, setReceiptLost] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownActive = cooldown > 0;
  const attemptRef = useRef<BulkAttempt | null>(null);
  const inspectionSequence = useRef(0);
  const inspectionController = useRef<AbortController | null>(null);
  const pollController = useRef<AbortController | null>(null);

  const errorText = useCallback((error: unknown) => {
    if (!(error instanceof RfqApiError)) return copy.errors.generic;
    if (error.retryAfterSeconds) setCooldown(error.retryAfterSeconds);
    const messages: Partial<Record<RfqApiError["kind"], string>> = {
      configuration: copy.errors.configuration,
      validation: copy.errors.validation,
      "inspection-invalid": copy.errors.inspection,
      "mapping-invalid": copy.errors.mappingMinimum,
      "payload-too-large": copy.errors.tooLarge,
      "unsupported-media-type": copy.errors.unsupported,
      capacity: copy.errors.capacity,
      network: copy.errors.network,
      "rate-limit": copy.cooldown.replace("{seconds}", String(error.retryAfterSeconds ?? 3)),
      "mapping-locked": copy.locked,
    };
    return messages[error.kind] ?? copy.errors.generic;
  }, [copy]);

  const loadInspection = useCallback(async (selection: { sourceSheetIndex?: number; headerRowNumber?: number } = {}) => {
    const sequence = ++inspectionSequence.current;
    inspectionController.current?.abort();
    const controller = new AbortController();
    inspectionController.current = controller;
    setBusy(true);
    setMessage("");
    try {
      const result = await getBulkInspection(selection, { signal: controller.signal });
      if (controller.signal.aborted || sequence !== inspectionSequence.current) return;
      setInspection(result);
      setSheetIndex(result.selectedSheet.index);
      setHeaderRow(result.headerRowNumber);
      setSelections({});
      setPhase("inspection");
    } catch (error) {
      if (controller.signal.aborted || sequence !== inspectionSequence.current) return;
      if (error instanceof RfqApiError && error.kind === "receipt-unavailable") {
        setReceiptLost(phase !== "recovering");
        setPhase("upload");
      } else setMessage(errorText(error));
    } finally {
      if (sequence === inspectionSequence.current) setBusy(false);
    }
  }, [errorText, phase]);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const recovered = await getBulkStatus({ signal: controller.signal });
        if (controller.signal.aborted) return;
        if (recovered.fileStatus === "awaiting-mapping" || recovered.fileStatus === "uploaded") {
          await loadInspection();
        } else {
          setStatus(recovered);
          setPhase("status");
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof RfqApiError && error.kind === "receipt-unavailable") setPhase("upload");
        else {
          setMessage(errorText(error));
          setPhase("upload");
        }
      }
    })();
    return () => controller.abort();
    // Recovery is intentionally run once per mounted locale route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cooldownActive) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [cooldownActive]);

  const refreshStatus = useCallback(async (signal?: AbortSignal) => {
    try {
      const next = await getBulkStatus({ signal });
      if (signal?.aborted) return null;
      setStatus(next);
      setPhase("status");
      setMessage("");
      return next;
    } catch (error) {
      if (signal?.aborted) return null;
      if (error instanceof RfqApiError && error.kind === "receipt-unavailable") {
        setReceiptLost(true);
        setPhase("upload");
        return null;
      }
      setMessage(errorText(error));
      return null;
    }
  }, [errorText]);

  useEffect(() => {
    if (phase !== "status" || !status || isBulkTerminal(status.fileStatus) || cooldown > 0) return;
    let timer: number | undefined;
    let stopped = false;
    const poll = async () => {
      if (stopped) return;
      const controller = new AbortController();
      pollController.current = controller;
      const next = await refreshStatus(controller.signal);
      if (!stopped && next && !isBulkTerminal(next.fileStatus)) {
        timer = window.setTimeout(poll, nextPollDelay(next.pollAfterSeconds, document.hidden));
      }
    };
    timer = window.setTimeout(poll, nextPollDelay(status.pollAfterSeconds, document.hidden));
    const visible = () => {
      if (document.visibilityState !== "visible") return;
      if (timer) window.clearTimeout(timer);
      pollController.current?.abort();
      void poll();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      stopped = true;
      if (timer) window.clearTimeout(timer);
      pollController.current?.abort();
      document.removeEventListener("visibilitychange", visible);
    };
  }, [cooldown, phase, refreshStatus, status]);

  function setField<K extends keyof BulkUploadDraft>(key: K, value: BulkUploadDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function upload(event: React.FormEvent) {
    event.preventDefault();
    if (busy || cooldown) return;
    const validation = validateBulkUpload(draft, file);
    if (validation.length) {
      const labels: Record<BulkUploadValidationCode, string> = {
        "file-required": copy.errors.fileRequired, "file-type": copy.errors.fileType,
        "file-size": copy.errors.fileSize, "contact-name": copy.errors.contactName,
        "company-name": copy.errors.companyName, "country-code": copy.errors.countryCode,
        email: copy.errors.email, privacy: copy.errors.privacy,
      };
      setMessage(labels[validation[0]]);
      return;
    }
    if (!file) return;
    setBusy(true);
    setMessage("");
    const metadata = mapBulkMetadata(locale, draft);
    const attempt = resolveBulkAttempt(attemptRef.current, bulkAttemptFingerprint(metadata, file));
    attemptRef.current = attempt;
    try {
      await submitBulkList(metadata, file, attempt.idempotencyKey);
      setFile(null);
      setReceiptLost(false);
      await loadInspection();
    } catch (error) {
      setMessage(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function applyInspectionSelection() {
    if (busy || cooldown) return;
    if (!Number.isInteger(headerRow) || headerRow < 1 || headerRow > 100) {
      setMessage(copy.errors.inspection);
      return;
    }
    await loadInspection({ sourceSheetIndex: sheetIndex, headerRowNumber: headerRow });
  }

  async function submitMapping() {
    if (!inspection || busy || cooldown) return;
    const payload = buildBulkMapping(inspection, selections);
    const validation = validateBulkMapping(payload);
    if (!validation.valid) {
      setMessage(validation.duplicate ? copy.errors.mappingDuplicate : copy.errors.mappingMinimum);
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const accepted = await submitBulkMapping(payload);
      setStatus({
        publicReference: accepted.publicReference,
        requestStatus: "submitted",
        fileStatus: accepted.fileStatus,
        processingScope: "parsed-and-validated",
        summary: { totalRows: 0, validRows: 0, invalidRows: 0, processingErrorRows: 0 },
        pollAfterSeconds: isBulkTerminal(accepted.fileStatus) ? null : 3,
      });
      setPhase("status");
      void refreshStatus();
    } catch (error) {
      if (error instanceof RfqApiError && error.kind === "mapping-locked") {
        setMessage(copy.locked);
        const current = await refreshStatus();
        if (!current) setPhase("inspection");
      } else if (error instanceof RfqApiError && error.kind === "receipt-unavailable") {
        setReceiptLost(true);
        setPhase("upload");
      } else setMessage(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  function startNew() {
    inspectionController.current?.abort();
    pollController.current?.abort();
    attemptRef.current = null;
    setDraft(initialDraft);
    setFile(null);
    setInspection(null);
    setStatus(null);
    setSelections({});
    setMessage("");
    setReceiptLost(false);
    setPhase("upload");
  }

  const activeStep = phase === "inspection" ? 1 : phase === "status" ? 2 : 0;
  return (
    <section className="bg-background px-4 pb-20 sm:px-6 lg:px-8" aria-busy={busy}>
      <div className="mx-auto max-w-5xl">
        <ol className="mb-8 grid grid-cols-3 gap-2" aria-label={copy.title}>
          {copy.steps.map((step, index) => (
            <li key={step} className={`rounded-md border px-3 py-3 text-center text-sm font-semibold ${index <= activeStep ? "border-primary bg-primary/10 text-white" : "border-border text-muted"}`} aria-current={index === activeStep ? "step" : undefined}>
              {index + 1}. {step}
            </li>
          ))}
        </ol>

        <div aria-live="polite" className="sr-only">{busy ? copy.uploading : message}</div>
        {message ? <div role="alert" className="mb-5 rounded-md border border-primary/40 bg-primary/10 p-4 text-sm font-semibold text-white">{message}</div> : null}
        {receiptLost ? <div role="alert" className="mb-5 rounded-md border border-primary/40 bg-primary/10 p-4 text-sm text-white">{copy.receiptLost}</div> : null}

        {phase === "recovering" ? (
          <div className="incar-card-elevated rounded-lg p-8 text-center text-white" role="status">{copy.recovering}</div>
        ) : null}

        {phase === "upload" ? (
          <form onSubmit={upload} className="incar-card-elevated grid gap-5 rounded-lg p-5 text-white sm:p-8" noValidate>
            <div><h2 className="text-2xl font-semibold">{copy.uploadTitle}</h2><p className="mt-2 text-sm leading-6 text-muted">{copy.uploadHelp}</p></div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="bulk-file">{copy.file}</label>
              <div className="flex flex-wrap items-center gap-3">
                <input id="bulk-file" type="file" accept={BULK_EXTENSIONS.join(",")} disabled={busy}
                  aria-describedby="bulk-file-status"
                  className="peer sr-only"
                  onChange={(event) => { setFile(event.target.files?.[0] ?? null); setMessage(""); }} />
                <label htmlFor="bulk-file"
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white">
                  {copy.chooseFile}
                </label>
                <span id="bulk-file-status" className="min-w-0 break-all text-sm text-muted" aria-live="polite">
                  {file?.name ?? copy.noFileSelected}
                </span>
              </div>
            </div>
            {file ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-background p-4 text-sm">
              <p className="min-w-0 break-all"><span className="font-semibold">{copy.selectedFile}:</span> {file.name} · {formatBytes(file.size)}</p>
              <button type="button" className="incar-focus min-h-11 rounded-md border border-border px-4 font-semibold" onClick={() => setFile(null)}>{copy.removeFile}</button>
            </div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="bulk-company" label={copy.companyName} value={draft.companyName} onChange={(v) => setField("companyName", v)} />
              <Field id="bulk-contact" label={copy.contactName} value={draft.contactName} onChange={(v) => setField("contactName", v)} />
              <Field id="bulk-country" label={copy.countryCode} value={draft.countryCode} maxLength={2} onChange={(v) => setField("countryCode", v)} />
              <Field id="bulk-city" label={copy.city} value={draft.city} onChange={(v) => setField("city", v)} />
              <Field id="bulk-email" label={copy.email} value={draft.email} type="email" onChange={(v) => setField("email", v)} />
              <Field id="bulk-phone" label={copy.phone} value={draft.phone} type="tel" onChange={(v) => setField("phone", v)} />
              <Field id="bulk-whatsapp" label={copy.whatsapp} value={draft.whatsapp} type="tel" onChange={(v) => setField("whatsapp", v)} />
              <label className="grid gap-2 text-sm font-semibold" htmlFor="bulk-business">{copy.businessType}
                <select id="bulk-business" value={draft.businessType} onChange={(e) => setField("businessType", e.target.value as BulkUploadDraft["businessType"])} className="incar-focus min-h-12 rounded-md border border-border bg-background px-3">
                  {businessValues.map((value, index) => <option key={value || "empty"} value={value}>{copy.businessTypes[index]}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold md:col-span-2" htmlFor="bulk-notes">{copy.notes}
                <textarea id="bulk-notes" rows={4} maxLength={4000} value={draft.customerNotes} onChange={(e) => setField("customerNotes", e.target.value)} className="incar-focus rounded-md border border-border bg-background p-3" />
              </label>
            </div>
            <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={draft.privacyConsent} onChange={(e) => setField("privacyConsent", e.target.checked)} className="incar-focus mt-1 size-5 shrink-0" />{copy.consent}</label>
            <button type="submit" disabled={busy || cooldown > 0} className="incar-focus min-h-12 rounded-md bg-primary px-5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? copy.uploading : cooldown ? copy.cooldown.replace("{seconds}", String(cooldown)) : copy.submit}</button>
          </form>
        ) : null}

        {phase === "inspection" && inspection ? (
          <div className="incar-card-elevated grid gap-6 rounded-lg p-5 text-white sm:p-8">
            <div><h2 className="text-2xl font-semibold">{copy.inspectionTitle}</h2><p className="mt-2 break-all text-sm text-muted">{copy.reference}: <bdi>{inspection.publicReference}</bdi></p></div>
            <div className="grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
              {inspection.format === "xlsx" ? <label className="grid gap-2 text-sm font-semibold" htmlFor="bulk-sheet">{copy.worksheet}
                <select id="bulk-sheet" value={sheetIndex} onChange={(e) => setSheetIndex(Number(e.target.value))} className="incar-focus min-h-12 rounded-md border border-border bg-background px-3">
                  {inspection.sheets.map((sheet) => <option key={sheet.index} value={sheet.index} disabled={sheet.state !== "visible"}>{sheet.name ?? `#${sheet.index + 1}`}{sheet.state !== "visible" ? ` — ${copy.hiddenSheet}` : ""}</option>)}
                </select>
              </label> : <div className="text-sm text-muted">CSV</div>}
              <Field id="bulk-header-row" label={copy.headerRow} value={String(headerRow)} type="number" min={1} max={100} onChange={(v) => setHeaderRow(Number(v))} />
              <button type="button" disabled={busy || cooldown > 0} onClick={applyInspectionSelection} className="incar-focus min-h-12 rounded-md border border-border px-5 font-semibold disabled:opacity-50">{busy ? copy.refreshingColumns : copy.applySelection}</button>
            </div>
            <p className="text-sm leading-6 text-muted">{copy.mappingHelp}</p>
            <div className="grid gap-3">
              {inspection.headers.map((header) => {
                const selectedElsewhere = new Set(Object.entries(selections).filter(([index]) => Number(index) !== header.index).map(([, value]) => value));
                return <div key={header.index} className="grid gap-3 rounded-md border border-border bg-background p-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.8fr)] sm:items-center">
                  <div className="min-w-0"><span className="text-xs font-semibold uppercase tracking-wide text-muted">{copy.sourceColumn}</span><p className="mt-1 break-words text-sm font-semibold">{header.display}</p></div>
                  <label className="grid gap-2 text-sm font-semibold" htmlFor={`bulk-map-${header.index}`}>{copy.targetField}
                    <select id={`bulk-map-${header.index}`} value={selections[header.index] ?? ""} onChange={(e) => setSelections((current) => ({ ...current, [header.index]: e.target.value as BulkTargetField | "" }))} className="incar-focus min-h-12 rounded-md border border-border bg-surface px-3">
                      <option value="">{copy.ignore}</option>
                      {inspection.mappingRequirements.targetFields.map((target) => {
                        const labelIndex = targetValues.indexOf(target);
                        return <option key={target} value={target} disabled={selectedElsewhere.has(target)}>{copy.targetLabels[labelIndex]}</option>;
                      })}
                    </select>
                  </label>
                </div>;
              })}
            </div>
            <button type="button" disabled={busy || cooldown > 0 || inspection.mappingRequirements.readOnly} onClick={submitMapping} className="incar-focus min-h-12 rounded-md bg-primary px-5 font-semibold disabled:cursor-not-allowed disabled:opacity-50">{busy ? copy.mapping : copy.submitMapping}</button>
          </div>
        ) : null}

        {phase === "status" && status ? <StatusCard copy={copy} status={status} busy={busy} message={message} onRefresh={() => void refreshStatus()} onStartNew={startNew} /> : null}
      </div>
    </section>
  );
}

function Field({ id, label, value, onChange, type = "text", ...limits }: {
  id: string; label: string; value: string; onChange: (value: string) => void; type?: string;
  maxLength?: number; min?: number; max?: number;
}) {
  return <label className="grid gap-2 text-sm font-semibold" htmlFor={id}>{label}<input id={id} value={value} type={type} onChange={(event) => onChange(event.target.value)} className="incar-focus min-h-12 rounded-md border border-border bg-background px-3" {...limits} /></label>;
}

function StatusCard({ copy, status, busy, message, onRefresh, onStartNew }: {
  copy: ReturnType<typeof getDictionary>["pages"]["bulkList"];
  status: BulkStatusResponse;
  busy: boolean;
  message: string;
  onRefresh: () => void;
  onStartNew: () => void;
}) {
  const labels: Record<BulkFileStatus, string> = {
    uploaded: copy.queued, "awaiting-mapping": copy.queued, queued: copy.queued,
    processing: copy.processing, completed: copy.completed,
    "completed-with-errors": copy.completedErrors, failed: copy.failed, cancelled: copy.failed,
  };
  const help = status.fileStatus === "queued" ? copy.queuedHelp : status.fileStatus === "processing" ? copy.processingHelp :
    status.fileStatus === "completed-with-errors" ? copy.completedErrorsHelp :
    status.fileStatus === "failed" || status.fileStatus === "cancelled" ? copy.failedHelp : copy.completedHelp;
  return <div className="incar-card-elevated grid gap-6 rounded-lg p-5 text-white sm:p-8" aria-busy={busy}>
    <div><h2 className="text-2xl font-semibold">{copy.statusTitle}</h2><p className="mt-2 text-sm text-muted">{copy.reference}: <bdi>{status.publicReference}</bdi></p></div>
    <div role="status" aria-live="polite" className="rounded-md border border-primary/35 bg-primary/10 p-5"><p className="text-xl font-semibold">{labels[status.fileStatus]}</p><p className="mt-2 text-sm leading-6 text-metallic-silver">{help}</p></div>
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[[copy.totalRows, status.summary.totalRows], [copy.validRows, status.summary.validRows], [copy.invalidRows, status.summary.invalidRows], [copy.processingErrors, status.summary.processingErrorRows]].map(([label, value]) => <div key={String(label)} className="rounded-md border border-border bg-background p-4"><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 text-2xl font-semibold">{value}</dd></div>)}
    </dl>
    <div className="flex flex-wrap gap-3">
      {!isBulkTerminal(status.fileStatus) && message ? <button type="button" disabled={busy} onClick={onRefresh} className="incar-focus min-h-11 rounded-md border border-border px-4 font-semibold">{copy.retry}</button> : null}
      {isBulkTerminal(status.fileStatus) ? <button type="button" onClick={onStartNew} className="incar-focus min-h-11 rounded-md bg-primary px-5 font-semibold">{copy.startNew}</button> : null}
    </div>
  </div>;
}
