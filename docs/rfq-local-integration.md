# Closed Product RFQ integration

The Product RFQ workspace calls the local INCAR Backend only. Set this public, non-secret frontend variable before starting Next.js:

```env
NEXT_PUBLIC_INCAR_API_BASE_URL=http://localhost:4000
```

The frontend submits `POST /v1/rfqs/product` through one RFQ API client. Requests use JSON, `credentials: "include"`, and a UUID v4 `Idempotency-Key`. A SHA-256 fingerprint is stored with the key only to detect whether the local payload changed; raw request data, receipt tokens, and cookies are not added to attempt storage.

Network retries reuse the same key while the mapped payload is unchanged. A changed payload receives a new key. Draft items and the attempt are cleared only after a successful `201` response or `200` idempotent replay.

After success, the browser opens `/[locale]/rfq/confirmation`. That page reads the safe receipt from `GET /v1/rfqs/receipt` with `credentials: "include"`. The receipt token remains in the Backend-issued HttpOnly cookie and never appears in JavaScript or the URL.

For local development, run the Backend at `http://localhost:4000` with CORS allowing the exact frontend origin (normally `http://localhost:3000`) and credentials enabled. File upload and the other request types are outside this integration.
