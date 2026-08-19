import type { TrustPillar, TrustProcessStep } from "@/types/trust";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";

export const trustPillars: TrustPillar[] = [
  {
    id: "quality-inspection-system",
    slug: "quality-inspection-system",
    title: "Auto Parts Expertise",
    shortDescription:
      "Part and OEM reference review grounded in wholesale auto parts supply requirements.",
    longDescription:
      "INCAR applies auto parts knowledge when reviewing references, application context, product categories, quantities, and specifications before preparing a quotation.",
    highlights: [
      "Sample review",
      "Product consistency checks",
      "Packaging inspection",
      "Label verification",
      "Pre-shipment checking",
    ],
    proofPoints: [
      "Inspection points are tied to the buyer RFQ and product requirements.",
      "Packaging and label details are reviewed against the agreed supply requirements.",
      "Quality notes stay practical and product-focused rather than promotional.",
    ],
    relatedCTA: {
      label: "Request Quotation",
      href: "/rfq",
      variant: "primary",
    },
    pageUsage: ["home", "about", "private-label", "quality-control", "rfq"],
  },
  {
    id: "factory-verification",
    slug: "factory-verification",
    title: "Manufacturing and Specification Knowledge",
    shortDescription:
      "Production-capability review and product-specification alignment for the request.",
    longDescription:
      "INCAR reviews production capability, communicates the required specifications, and manages the approved production requirements for the order.",
    highlights: [
      "Production capability",
      "Production capability review",
      "Category matching",
      "Production communication",
      "Production planning",
    ],
    proofPoints: [
      "Manufacturing decisions consider category fit, capability, MOQ, lead time, and order requirements.",
      "Production communication stays aligned with approved order requirements.",
      "A capability review is order-specific and not a blanket certification.",
    ],
    relatedCTA: {
      label: "Request an Unlisted Part",
      href: "/contact",
      variant: "secondary",
    },
    pageUsage: ["home", "about", "private-label", "quality-control"],
  },
  {
    id: "packaging-control",
    slug: "packaging-control",
    title: "Inspection and Quality Control",
    shortDescription:
      "Support for export carton review, private label packaging, barcode checks, and Arabic/English readiness.",
    longDescription:
      "INCAR manages packaging requirements across export cartons, private label boxes, product labels, barcode details, Arabic/English information, and carton marking support.",
    highlights: [
      "Export carton review",
      "Private Label packaging management",
      "Barcode and label checks",
      "Arabic/English packaging readiness",
      "Carton marking support",
    ],
    proofPoints: [
      "Packaging requirements are collected before manufacturing and production approval.",
      "Barcode, label, and carton-marking details can be reviewed with manufacturing documents.",
      "Private Label packaging stays aligned with the target wholesale market requirements.",
    ],
    relatedCTA: {
      label: "Private Label Inquiry",
      href: "/private-label#private-label-inquiry",
      variant: "primary",
    },
    pageUsage: ["home", "private-label", "quality-control", "catalogs"],
  },
  {
    id: "export-documentation",
    slug: "export-documentation",
    title: "Attention to Detail",
    shortDescription:
      "Commercial invoice support, packing-list support, product information preparation, and shipment-document inputs.",
    longDescription:
      "INCAR manages agreed invoice and packing-list inputs, product information, shipment-document inputs, and customer communication during order follow-up.",
    highlights: [
      "Commercial invoice support",
      "Packing list support",
      "Product information preparation",
      "Shipment-document inputs",
      "Buyer communication support",
    ],
    proofPoints: [
      "Documentation support follows the product list, quantities, and packing details.",
      "Export information is managed against customer and order requirements.",
      "INCAR assists with order documentation without making legal or border-process guarantees.",
    ],
    relatedCTA: {
      label: "Speak With INCAR",
      href: "/contact",
      variant: "primary",
    },
    pageUsage: ["home", "about", "private-label", "quality-control", "rfq"],
  },
  {
    id: "middle-east-market-focus",
    slug: "middle-east-market-focus",
    title: "China Market Knowledge",
    shortDescription:
      "RFQ-based INCAR product review for wholesalers and importers across Middle Eastern markets.",
    longDescription:
      "INCAR applies product and manufacturing knowledge for wholesalers, importers, distributors, and auto parts buyers across the Middle East.",
    highlights: [
      "Middle Eastern wholesale buyer focus",
      "Toyota and Hyundai launch focus",
      "RFQ-based product review",
      "WhatsApp-friendly communication",
      "Private Label for target-market needs",
    ],
    proofPoints: [
      "The service is structured around wholesale RFQ and inquiry workflows.",
      "Production capability is reviewed against order requirements.",
      "Buyer communication can continue through WhatsApp or email after inquiry review.",
    ],
    relatedCTA: {
      label: "Submit RFQ",
      href: "/rfq",
      variant: "primary",
    },
    pageUsage: ["home", "about", "quality-control", "catalogs", "rfq"],
  },
  {
    id: "china-advantage",
    slug: "china-advantage",
    title: "Clear Arabic, English, and Chinese Communication",
    shortDescription:
      "Clear communication across customer requirements and production work in three languages.",
    longDescription:
      "INCAR communicates with customers in Arabic or English and supports Chinese production communication when required.",
    highlights: [
      "Production capability insight",
      "Chinese production communication",
      "Product development flexibility",
      "Private Label support",
      "Clear production communication",
    ],
    proofPoints: [
      "Language support strengthens the process but is not INCAR's primary value.",
      "Customer requirements can be converted into production instructions.",
      "Product and quotation communication remains with INCAR.",
    ],
    relatedCTA: {
      label: "Explore Services",
      href: "/",
      variant: "secondary",
    },
    pageUsage: ["home", "about", "quality-control"],
  },
];

export const trustProcessSteps: TrustProcessStep[] = [
  {
    id: "requirements-review",
    title: "Requirement Review",
    description:
      "Check Part Numbers or OEM References, product names, application context, quantities, packaging needs, and target-market details before quotation work begins.",
    order: 1,
  },
  {
    id: "manufacturing-source-selection",
    title: "Production Planning",
    description:
      "Review product families by category fit, production capability, MOQ, sample readiness, timing, packaging support, and order requirements.",
    order: 2,
  },
  {
    id: "sample-specification-check",
    title: "Sample or Specification Check",
    description:
      "Support agreed sample review, OEM Reference checks, specification review, and product consistency checkpoints before quotation or production approval.",
    order: 3,
  },
  {
    id: "packaging-label-review",
    title: "Packaging and Label Review",
    description:
      "Review box details, barcode and label information, Arabic/English readiness, and carton marking requirements.",
    order: 4,
  },
  {
    id: "pre-shipment-readiness",
    title: "Pre-shipment Readiness Review",
    description:
      "Prepare practical checkpoints for packaging, quantities, product information, and inspection notes before goods leave China.",
    order: 5,
  },
  {
    id: "quotation-supply-follow-up",
    title: "Quotation and Order Follow-up",
    description:
      "Handle quotation follow-up, production communication, packing information, and agreed order-document inputs for customers.",
    order: 6,
  },
];

export const futureTrustProofAssets =
  "Planned reference materials may include inspection photos, packaging samples, export document examples, and verified case studies.";

export function getLocalizedTrustPillars(locale: Locale = defaultLocale): TrustPillar[] {
  const dictionary = getDictionary(locale);

  return trustPillars.map((pillar) => {
    const localized = dictionary.trust.pillars[pillar.slug as keyof typeof dictionary.trust.pillars];

    return {
      ...pillar,
      title: localized.title,
      shortDescription: localized.shortDescription,
      longDescription: localized.longDescription,
      highlights: [...localized.highlights],
      proofPoints: [...localized.proofPoints],
      relatedCTA: {
        ...pillar.relatedCTA,
        label: localized.cta,
      },
    };
  });
}

export function getTrustProcessSteps(locale: Locale = defaultLocale): TrustProcessStep[] {
  return getDictionary(locale).trust.process.map((step) => ({ ...step }));
}

export function getFutureTrustProofAssets(locale: Locale = defaultLocale) {
  return getDictionary(locale).trust.futureAssets;
}

export const getTrustPillarsBySlug = (
  slugs: string[],
  locale: Locale = defaultLocale,
) => getLocalizedTrustPillars(locale).filter((pillar) => slugs.includes(pillar.slug));
