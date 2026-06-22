# INCAR AUTO PARTS Frontend Foundation

## Product Positioning

INCAR AUTO PARTS is positioned as Global Automotive Supply & Private Label Solutions from China to Saudi Arabia. The platform is a China-based B2B lead generation and sourcing website for Saudi wholesale auto parts buyers. It is a professional RFQ workflow, not a consumer shopping storefront: buyers search products, add items to an RFQ list, upload bulk Excel requirements, and submit quotation requests.

## Application Structure

- `src/app`: App Router pages, product detail routes, and SEO metadata.
- `src/components`: reusable UI and business workflow components.
- `src/contexts`: client-side RFQ and locale-direction providers.
- `src/data`: structured mock brands, vehicle models, categories, products, catalogs, RFQ items, and private label services.
- `src/features`: feature entry points for products, RFQ, private label, and catalogs.
- `src/lib`: shared helpers such as metadata generation.
- `src/types`: shared domain models.
- `public/images`: generated hero and product/category assets.

## Core Data Models

### Product

Products include `name`, `brand`, `carModel`, `category`, `partNumber`, `oemNumber`, `compatibleVehicles`, `image`, `specifications`, `moq`, `origin`, `privateLabelAvailable`, `leadTime`, and `qualityGrade`.

### Catalog

Catalogs include `slug`, `title`, `description`, `brand`, `fileType`, `updated`, `items`, and `audience`.

### RFQ Item

RFQ state stores `productId` and `quantity`. This is intentionally separate from retail ordering language and can later map to database-backed quotation line items.

## Core Components

- `Header`, `Footer`, `FloatingWhatsapp`: global trust and conversion shell.
- `Hero`, `TrustIndicators`, `PrivateLabelSection`, `ProcessSection`, `CatalogCard`, `CTAButton`: reusable landing and sourcing sections.
- `ProductExplorer`: search and filtering by part number, OEM number, model, brand, and category.
- `ProductCard`, `ProductImage`, `AddToRfqButton`: product discovery and RFQ-only actions.
- `RFQForm`: quotation lead capture with selected products and Excel upload.
- `PrivateLabelForm`: dedicated private label inquiry workflow.
- `SectionHeader`, `ButtonLink`: reusable presentation primitives kept for compatibility.

## Routing

- `/`: homepage with B2B positioning, trust indicators, process, catalogs, and featured products.
- `/products`: searchable product catalog.
- `/products/toyota`: Toyota-focused catalog page.
- `/products/hyundai`: Hyundai-focused catalog page.
- `/products/[slug]`: SEO-friendly product details.
- `/private-label`: core private label business page.
- `/catalogs`: catalog lead magnets.
- `/rfq`: request quotation workflow.
- `/about`: sourcing company positioning.
- `/contact`: contact and WhatsApp lead capture.

## Future Backend Path

The current mock data can later be replaced by repository functions backed by a database. RFQ submissions should become durable records with related line items and uploaded Excel files. Catalog download requests can become leads. Private label inquiries can become a separate lead type for CRM routing.
