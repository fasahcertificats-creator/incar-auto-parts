# Product Data Standard

INCAR AUTO PARTS product data is structured for B2B RFQ, sourcing, export, catalog, and private label workflows. Data quality is more important than quantity.

## Launch Scope

Active launch brands are Toyota and Hyundai only.

Active Toyota models:
- Camry
- Corolla
- Hilux
- Yaris
- Land Cruiser
- Fortuner

Active Hyundai models:
- Accent
- Elantra
- Sonata
- Tucson
- Santa Fe
- Creta

## Product Fields

Each product follows `src/types/product.ts`:

- `id`: stable internal product id
- `slug`: route-safe product slug
- `name`: display name
- `brand`: Toyota or Hyundai
- `vehicleModel`: primary display and filter model
- `category`: one supported launch category
- `partNumber`: sample INCAR/internal part number
- `oemNumber`: sample OEM reference
- `compatibility`: structured `ProductFitment[]`
- `imageUrl`: product image path
- `specifications`: `Record<string, string>` for labeled product facts
- `moq`: positive numeric MOQ
- `origin`: China
- `privateLabelAvailable`: private label availability flag
- `status`: active or draft
- `isSampleData`: marks mock/sample records

## ProductFitment Fields

Compatibility must be structured, not a plain string array:

- `brand`: Toyota or Hyundai
- `model`: active vehicle model when possible
- `generation`: optional generation/platform note
- `yearFrom`: optional year start
- `yearTo`: optional year end
- `engineNotes`: optional engine note
- `trimNotes`: optional trim or market note

Optional year and notes fields prevent the UI from inventing unverified fitment. If years are missing, the product detail page asks for RFQ review.

## Why Structured Fitment

Structured fitment supports future VIN lookup, AI product matching, and PostgreSQL/Prisma mapping. It allows search and filters to reason over brand, model, generation, and year ranges without parsing free text.

## Sample Data Rule

Current products are sample data for UI and architecture testing only. Verify all part numbers, OEM numbers, and fitment before production use.

## Future Readiness

This shape can map cleanly to relational tables for products, brands, vehicle models, categories, fitments, and RFQ line items. It also gives future AI matching clear fields for comparing buyer RFQs against product data without relying on brittle text matching.

