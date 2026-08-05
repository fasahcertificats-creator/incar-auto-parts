# INCAR AUTO PARTS Frontend Foundation

## Commercial Positioning

INCAR AUTO PARTS is a specialized B2B auto parts supplier serving wholesalers and importers across the Middle East from China. The customer deals with INCAR. INCAR reviews requirements, selects factories and manufacturing sources internally, performs pricing analysis, issues quotations under the INCAR name, and manages the agreed specifications, production, quality-control checkpoints, packaging, and supply follow-up.

The public website is an RFQ-led discovery and request-preparation surface. It is not a marketplace, factory directory, broker, translator, or customer-to-factory connection service. Production upload and submission remain inactive until a secure workflow is implemented.

## Application Structure

- `src/app`: App Router pages, localized routes, product detail routes, and SEO metadata.
- `src/components`: reusable UI and commercial-workflow components.
- `src/contexts`: client-side RFQ draft and locale-direction providers.
- `src/data/production`: production catalog intake and publication source.
- `src/data`: structured development fixtures and service content.
- `src/features`: discovery, local RFQ draft, Private Label, trust, and catalog features.
- `src/lib`: shared metadata, catalog, discovery, and validation helpers.
- `src/types`: shared domain models.

## Discovery and Catalog Rules

Toyota and Hyundai makes and models are an initial browsing structure only. Empty model pages must state that no products are published. Product and catalog records appear publicly only after they pass the existing production intake and publication rules.

Catalogs are INCAR catalogs containing products reviewed and approved by INCAR. They are not factory listings or manufacturing-source libraries. Empty catalog states must remain honest.

## RFQ Draft Contract

RFQ state remains a local device draft. Current request types, request intent, discovery eligibility, and request-item architecture must remain unchanged.

A future product-request item should capture:

- Part or OEM number.
- Product name when known.
- Make, model, and year when application context is needed.
- Quantity.
- Reference image when available.
- Notes and specification requirements.

A reference image may be recommended, but it is optional when a clear part number is available and never proves compatibility by itself. Future customer details should include company, contact name, country or market, email, and an approved phone or WhatsApp channel. No file upload, email, WhatsApp, or submission is active now.

## Routing

The localized public routes cover home, About, Sourcing Services, Private Label, Parts, RFQ, Catalogs, and Contact in Arabic and English. Locale routing, the sitemap structure, the Discovery Repository, search contract, eligibility rules, and the production catalog intake pipeline remain authoritative.

## Future Backend Path

Any future persistence, file processing, messaging, catalog request, or CRM integration requires a separately approved backend phase. This document does not authorize or imply those capabilities.
