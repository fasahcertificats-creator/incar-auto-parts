import type { TrustPillar, TrustProcessStep } from "@/types/trust";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";

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
    pageUsage: ["home", "about", "private-label", "quality-control", "rfq"],
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
      label: "Start Sourcing Request",
      href: "/contact",
      variant: "secondary",
    },
    pageUsage: ["home", "about", "private-label", "quality-control"],
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
    title: "Export Documentation",
    shortDescription:
      "Commercial invoice support, packing list support, product information preparation, and shipment document coordination.",
    longDescription:
      "INCAR assists with commercial invoice support, packing list support, product information preparation, shipment coordination documents, and buyer communication during the export workflow.",
    highlights: [
      "Commercial invoice support",
      "Packing list support",
      "Product information preparation",
      "Shipment coordination documents",
      "Buyer communication support",
    ],
    proofPoints: [
      "Documentation support follows the product list, quantities, and packing details.",
      "Export information is coordinated with suppliers and buyer communication needs.",
      "INCAR assists with sourcing documentation without making legal or border-process guarantees.",
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
    title: "Middle Eastern Market Focus",
    shortDescription:
      "RFQ-based sourcing for auto parts wholesalers and importers across Middle Eastern markets.",
    longDescription:
      "INCAR supports wholesalers, importers, distributors, and B2B auto parts buyers across the Middle East through RFQ-based sourcing and Private Label coordination from China.",
    highlights: [
      "Middle Eastern wholesale buyer focus",
      "Toyota and Hyundai launch focus",
      "RFQ-based sourcing",
      "WhatsApp-friendly communication",
      "Private Label for target-market needs",
    ],
    proofPoints: [
      "The platform is structured around wholesale RFQ and inquiry workflows.",
      "Launch product data stays focused on Toyota and Hyundai programs.",
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
      "Check part numbers, categories, quantities, packaging needs, and target market details before supplier coordination.",
    order: 1,
  },
  {
    id: "supplier-product-matching",
    title: "Supplier / Product Matching",
    description:
      "Help compare factory options and product families by category fit, MOQ, sample readiness, lead time, packaging support, and export readiness.",
    order: 2,
  },
  {
    id: "sample-specification-check",
    title: "Sample or Specification Check",
    description:
      "Support sample review, OEM number checks, specification review, and product consistency checkpoints before quotation or production coordination.",
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
    id: "rfq-export-coordination",
    title: "RFQ / Export Coordination",
    description:
      "Assist with RFQ follow-up, supplier communication, packing information, and export coordination documents for buyers.",
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
