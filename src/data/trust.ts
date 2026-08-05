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
      "Quality notes stay practical and sourcing-focused rather than promotional.",
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
      "Internal factory selection, production-capability review, and specification alignment for the request.",
    longDescription:
      "INCAR evaluates factories and manufacturing sources internally, communicates the required specifications, and selects the source it considers suitable for the reviewed order.",
    highlights: [
      "Factory screening",
      "Production capability review",
      "Category matching",
      "Factory communication support",
      "Manufacturing-source selection",
    ],
    proofPoints: [
      "Manufacturing decisions consider category fit, capability, MOQ, lead time, and order requirements.",
      "Factory communication remains internal to INCAR's supply process.",
      "A manufacturing-source review is not a blanket certification or permanent approval.",
    ],
    relatedCTA: {
      label: "Start Sourcing Request",
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
      "INCAR manages agreed invoice and packing-list inputs, product information, shipment-document inputs, and customer communication during supply follow-up.",
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
      "INCAR assists with supply documentation without making legal or border-process guarantees.",
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
      "RFQ-based sourcing for auto parts wholesalers and importers across Middle Eastern markets.",
    longDescription:
      "INCAR applies China market and manufacturing knowledge while supplying wholesalers, importers, distributors, and B2B auto parts buyers across the Middle East.",
    highlights: [
      "Middle Eastern wholesale buyer focus",
      "Toyota and Hyundai launch focus",
      "RFQ-based sourcing",
      "WhatsApp-friendly communication",
      "Private Label for target-market needs",
    ],
    proofPoints: [
      "The service is structured around wholesale RFQ and inquiry workflows.",
      "Manufacturing sources remain internal to INCAR's supply process.",
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
      "Clear communication across customer requirements and internal manufacturing work in three languages.",
    longDescription:
      "INCAR communicates with customers in Arabic or English and handles Chinese manufacturing communication internally as a supporting capability within the supply relationship.",
    highlights: [
      "China factory access",
      "Chinese manufacturing communication",
      "Product sourcing flexibility",
      "Private Label support",
      "Faster factory communication",
    ],
    proofPoints: [
      "Language support strengthens the process but is not INCAR's primary value.",
      "Customer requirements can be converted into internal manufacturing instructions.",
      "The customer continues to deal commercially with INCAR, not with the factory.",
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
      "Check part or OEM numbers, product names, application context, quantities, packaging needs, and target-market details before quotation work begins.",
    order: 1,
  },
  {
    id: "manufacturing-source-selection",
    title: "Manufacturing Source Selection",
    description:
      "Help compare factory options and product families by category fit, MOQ, sample readiness, lead time, packaging support, and export readiness.",
    order: 2,
  },
  {
    id: "sample-specification-check",
    title: "Sample or Specification Check",
    description:
      "Support agreed sample review, OEM number checks, specification review, and product consistency checkpoints before quotation or production approval.",
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
    title: "Quotation and Supply Follow-up",
    description:
      "Handle quotation follow-up, internal manufacturing communication, packing information, and agreed supply-document inputs for customers.",
    order: 6,
  },
];

export const futureTrustProofAssets =
  "Future proof assets may include inspection photos, packaging samples, export document examples, and verified case studies.";

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
