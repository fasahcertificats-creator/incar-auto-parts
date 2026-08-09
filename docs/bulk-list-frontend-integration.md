# Bulk List frontend integration

The canonical customer route is `/{locale}/rfq/upload-list`. It is one state-driven journey: upload, safe inspection and column mapping, then parsing/validation status. It uses the real Backend and never presents a local or fabricated confirmation.

## API contract

- `POST /v1/rfqs/bulk-list` sends `metadata` and `file` in `FormData`. The browser owns the multipart boundary; the client does not set `Content-Type`. The request includes credentials and an in-memory UUID v4 `Idempotency-Key` that is reused only for a retry of the same file and metadata.
- `GET /v1/rfqs/bulk-list/inspection` optionally sends only `sourceSheetIndex` and `headerRowNumber`. It returns bounded sheet/header metadata, never source rows.
- `POST /v1/rfqs/bulk-list/mapping` sends strict version 1 JSON with the selected sheet, header row, and mapped source columns. Duplicate targets are prevented and at least one identification field is required.
- `GET /v1/rfqs/bulk-list/status` reports queued, processing, or a terminal parsing/validation result. Completed does not mean matched, quoted, or available.

## Receipt ownership and recovery

The Backend rotates and owns the HttpOnly receipt cookie. The frontend includes credentials but never reads or copies the cookie. No receipt, request ID, file ID, storage key, contact data, or token is placed in the URL. On route load, status recovery identifies processing or terminal requests; an awaiting-mapping request is reconstructed through inspection. A missing, invalid, or expired receipt returns to a safe new-upload state.

Changing locale navigates to the same localized route. After upload, the Backend receipt reconstructs the journey. Before upload, the selected file and contact form may be lost; this is intentional because file bytes and contact PII are not persisted.

## Privacy and storage

The selected `File`, filename, contact values, headers, and mapping exist only in React memory. The implementation does not write them to localStorage, sessionStorage, IndexedDB, URL state, or JavaScript cookies and does not log file contents. Filenames and Backend headers render as ordinary React text.

## Polling and failures

Only one status request runs at a time. Each response schedules the next poll using `pollAfterSeconds`; queued is stable and has no artificial failure timeout. Background tabs use a reduced 15-second cadence and refresh immediately when visible. Requests are aborted on unmount. `429 Retry-After` produces a disabled cooldown, while network errors are recoverable. Mapping replay is accepted; a different locked mapping explains the state and loads current status.

## Local run and visual QA

Local functional integration requires PostgreSQL, the Backend API, the Bulk worker, and this frontend with `NEXT_PUBLIC_INCAR_API_BASE_URL` configured. Use synthetic CSV/XLSX data only, remove its database rows and private storage objects after verification, then stop Compose without `-v` so the PostgreSQL volume remains.

Visual QA covers Arabic and English on desktop, 768 px, and 390 × 844, including long headers, selects, keyboard focus, status states, overflow, touch targets, and a clean browser console. No deployment is part of this workflow.
