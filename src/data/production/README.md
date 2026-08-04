# Production catalog intake

`catalog.json` is the only production intake source. It starts empty and must
not contain samples, placeholders, or inferred commercial data.

## Intake order

1. Add makes with stable IDs and localized names.
2. Add models that reference an existing make ID.
3. Add categories with stable IDs and localized names.
4. Add products that reference an existing category ID.
5. Add an INCAR part number, OEM references, or both.
6. Add vehicle relationships using matching make and model IDs.
7. Run `npm run validate:catalog`.
8. Resolve every error; review warnings without weakening validation.
9. Run the application checks and inspect routes and the sitemap.
10. Treat records as publishable only after validation and build succeed.

## Templates

The files in `templates/` list required and optional fields only. They contain
no production records and are not imported by the application.

## Publication boundary

The raw JSON is validated, normalized for comparison, mapped to the existing
Discovery domain, and filtered by publishing eligibility. App Router pages do
not import `catalog.json` directly. Provenance and internal request notes are
accepted for operator review but are not mapped into public product records.

Reference normalization never replaces the display value. It is used only for
search, comparison, and duplicate detection.
