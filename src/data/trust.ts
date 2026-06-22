import type { TrustPillar, TrustProcessStep } from "@/types/trust";

export const trustPillars: TrustPillar[] = [
  {
    id: "quality-inspection-system",
    slug: "quality-inspection-system",
    title: "Quality Inspection System",
    shortDescription:
      "Inspection support for samples, product consistency, packaging, labels, and pre-shipment checks.",
    longDescription:
      "INCAR helps buyers review product samples, compare production consistency, inspect packaging details, verify label information, and prepare pre-shipment checking points before goods leave China.",
    highlights: [
      "Sample review",
      "Product consistency checks",
      "Packaging inspection",
      "Label verification",
      "Pre-shipment checking",
    ],
    proofPoints: [
      "Inspection points are tied to the buyer RFQ and product requirements.",
      "Packaging and label details are reviewed before export coordination.",
      "Quality notes stay practical and sourcing-focused rather than promotional.",
    ],
    relatedCTA: {
      label: "Request Quotation",
      href: "/rfq",
      variant: "primary",
    },
  },
  {
    id: "factory-verification",
    slug: "factory-verification",
    title: "Factory Verification",
    shortDescription:
      "Supplier screening, production capability review, category matching, and factory communication support.",
    longDescription:
      "INCAR helps screen supplier options, compare production capability, match factories by category, coordinate factory communication, and organize supplier comparisons for wholesale sourcing decisions.",
    highlights: [
      "Supplier screening",
      "Production capability review",
      "Category matching",
      "Factory communication support",
      "Supplier option comparison",
    ],
    proofPoints: [
      "Supplier comparison is based on category fit, MOQ, lead time, and export readiness.",
      "Factory communication is coordinated around buyer requirements and product details.",
      "Supplier notes are presented as review support, not as blanket approval claims.",
    ],
    relatedCTA: {
      label: "Learn About INCAR",
      href: "/about",
      variant: "secondary",
    },
  },
  {
    id: "packaging-control",
    slug: "packaging-control",
    title: "Packaging Control",
    shortDescription:
      "Support for export carton review, private label packaging, barcode checks, and Arabic/English readiness.",
    longDescription:
      "INCAR coordinates packaging requirements across export cartons, private label boxes, product labels, barcode details, Arabic/English information, and carton marking support.",
    highlights: [
      "Export carton review",
      "Private Label packaging coordination",
      "Barcode and label checks",
      "Arabic/English packaging readiness",
      "Carton marking support",
    ],
    proofPoints: [
      "Packaging requirements are collected before sourcing and production coordination.",
      "Barcode, label, and carton marking details can be reviewed with supplier documents.",
      "Private Label packaging stays aligned with Saudi wholesale market needs.",
    ],
    relatedCTA: {
      label: "Private Label Inquiry",
      href: "/private-label#private-label-inquiry",
      variant: "primary",
    },
  },
  {
    id: "export-documentation",
    slug: "export-documentation",
    title: "Export Documentation",
    shortDescription:
      "Commercial invoice support, packing list support, product information preparation, and shipment document coordination.",
    longDescription:
      "INCAR assists with commercial invoice support, packing list support, product information preparation, shipment coordination documents, and communication with Saudi buyers during the export workflow.",
    highlights: [
      "Commercial invoice support",
      "Packing list support",
      "Product information preparation",
      "Shipment coordination documents",
      "Saudi buyer communication support",
    ],
    proofPoints: [
      "Documentation support follows the product list, quantities, and packing details.",
      "Export information is coordinated with suppliers and buyer communication needs.",
      "INCAR assists with sourcing documentation without making legal or border-process guarantees.",
    ],
    relatedCTA: {
      label: "Request Quotation",
      href: "/rfq",
      variant: "primary",
    },
  },
  {
    id: "saudi-market-focus",
    slug: "saudi-market-focus",
    title: "Saudi Market Focus",
    shortDescription:
      "RFQ-based sourcing for Saudi wholesale buyers with Toyota and Hyundai launch focus and WhatsApp-friendly communication.",
    longDescription:
      "INCAR focuses on Saudi wholesale buyers, RFQ-based sourcing, Toyota and Hyundai launch programs, WhatsApp-friendly communication, and Private Label support for Saudi market requirements.",
    highlights: [
      "Saudi wholesale buyer focus",
      "Toyota and Hyundai launch focus",
      "RFQ-based sourcing",
      "WhatsApp-friendly communication",
      "Private Label for Saudi market needs",
    ],
    proofPoints: [
      "The platform is structured around Saudi wholesale RFQ and inquiry workflows.",
      "Launch product data stays focused on Toyota and Hyundai programs.",
      "Buyer communication can continue through WhatsApp or email after inquiry review.",
    ],
    relatedCTA: {
      label: "Submit RFQ",
      href: "/rfq",
      variant: "primary",
    },
  },
  {
    id: "china-advantage",
    slug: "china-advantage",
    title: "China Advantage",
    shortDescription:
      "China factory access, supplier comparison, flexible sourcing, Private Label support, and faster factory communication.",
    longDescription:
      "INCAR helps buyers use China factory access, supplier comparison, product sourcing flexibility, Private Label coordination, and closer communication with Chinese factories.",
    highlights: [
      "China factory access",
      "Supplier comparison",
      "Product sourcing flexibility",
      "Private Label support",
      "Faster factory communication",
    ],
    proofPoints: [
      "China-based sourcing support helps coordinate supplier communication and samples.",
      "Supplier options can be compared by category, MOQ, packaging support, and export readiness.",
      "Private Label requirements can be reviewed close to the sourcing and production workflow.",
    ],
    relatedCTA: {
      label: "Learn About INCAR",
      href: "/about",
      variant: "secondary",
    },
  },
];

export const trustProcessSteps: TrustProcessStep[] = [
  {
    id: "requirements-review",
    title: "Review buyer requirements",
    description:
      "Check part numbers, categories, quantities, packaging needs, and target market details before supplier coordination.",
    order: 1,
  },
  {
    id: "supplier-comparison",
    title: "Compare supplier options",
    description:
      "Help compare factory options by category fit, MOQ, sample readiness, lead time, packaging support, and export readiness.",
    order: 2,
  },
  {
    id: "sample-packaging-check",
    title: "Check samples and packaging",
    description:
      "Support sample review, packaging inspection, label verification, and product consistency checkpoints.",
    order: 3,
  },
  {
    id: "export-coordination",
    title: "Coordinate export details",
    description:
      "Assist with packing information, product details, supplier communication, and shipment document coordination.",
    order: 4,
  },
];

export const getTrustPillarsBySlug = (slugs: string[]) =>
  trustPillars.filter((pillar) => slugs.includes(pillar.slug));
