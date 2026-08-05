import type {
  PrivateLabelCategoryDetail,
  PrivateLabelProcessStep,
  PrivateLabelService,
  PrivateLabelTrustPoint,
} from "@/types/private-label";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";

export const privateLabelTrustPoints: PrivateLabelTrustPoint[] = [
  { id: "china-factory-sourcing", label: "China factory sourcing" },
  { id: "custom-packaging", label: "Custom packaging" },
  { id: "quality-inspection", label: "Quality inspection" },
  { id: "middle-east-wholesale-focus", label: "Middle Eastern wholesale market focus" },
];

export const privateLabelServices: PrivateLabelService[] = [
  {
    id: "product-sourcing",
    title: "Product sourcing",
    description:
      "Identify suitable product programs by category, quantity range, quality grade, and target-market demand.",
  },
  {
    id: "factory-matching",
    title: "Factory matching",
    description:
      "INCAR selects manufacturing sources internally by capability, specification fit, sample timing, and packaging support.",
  },
  {
    id: "custom-packaging",
    title: "Custom packaging",
    description:
      "Plan box structure, material, label placement, carton marks, and market-ready packaging details.",
  },
  {
    id: "logo-printing",
    title: "Logo printing",
    description:
      "Manage logo placement across boxes, labels, product inserts, and approved brand materials.",
  },
  {
    id: "barcode-label-design",
    title: "Barcode and label design",
    description:
      "Prepare barcode, product label, and Arabic/English packaging details for wholesale distribution.",
  },
  {
    id: "oem-odm-support",
    title: "OEM / ODM support",
    description:
      "Support specification alignment, OEM reference matching, sample review, and production management.",
  },
  {
    id: "quality-inspection",
    title: "Quality inspection",
    description:
      "Set inspection checkpoints for samples, packaging, label accuracy, and pre-shipment consistency.",
  },
  {
    id: "export-documentation",
    title: "Export documentation",
    description:
      "Manage invoice inputs, packing-list details, carton information, and agreed supply documentation.",
  },
  {
    id: "supply-follow-up-middle-east",
    title: "Supply follow-up for Middle Eastern markets",
    description:
      "Align production timing, packing details, and destination requirements for a Middle Eastern wholesale market.",
  },
];

export const privateLabelProcessSteps: PrivateLabelProcessStep[] = [
  {
    step: "01",
    title: "Choose product category",
    description:
      "Select the launch category and share target part types, quality grade, MOQ range, and priority market.",
  },
  {
    step: "02",
    title: "Share brand requirements",
    description:
      "Provide brand name, logo status, preferred packaging direction, label language, and buyer requirements.",
  },
  {
    step: "03",
    title: "Packaging and label planning",
    description:
      "Define box design, logo placement, barcode label, carton marking, and Arabic/English information needs.",
  },
  {
    step: "04",
    title: "Sample confirmation",
    description:
      "Review product samples, packaging samples, label details, and manufacturing readiness before production.",
  },
  {
    step: "05",
    title: "Production and quality inspection",
    description:
      "Manage agreed production checkpoints, packaging inspection, label verification, and consistency checks.",
  },
  {
    step: "06",
    title: "Export and shipping follow-up",
    description:
      "Prepare agreed export-document inputs, packing details, internal manufacturing communication, and destination requirements for the target market.",
  },
];

export const privateLabelCategories: PrivateLabelCategoryDetail[] = [
  {
    category: "Brake System",
    description:
      "Fast-moving brake items can support clear brand positioning when quality grade, fitment, and packaging are controlled.",
  },
  {
    category: "Suspension Parts",
    description:
      "Suspension programs benefit from durable packaging, consistent manufacturing checks, and clear wholesale labeling.",
  },
  {
    category: "Filters",
    description:
      "Filter lines are suitable for private label because packaging, barcode labeling, and reorder planning are central to distribution.",
  },
  {
    category: "Engine Parts",
    description:
      "Selected engine service parts can support branded sourcing when OEM references and sample confirmation are handled carefully.",
  },
  {
    category: "Interior Parts",
    description:
      "Interior items can use private label packaging for organized range building, product labels, and showroom-ready presentation.",
  },
];

export function getPrivateLabelTrustPoints(
  locale: Locale = defaultLocale,
): PrivateLabelTrustPoint[] {
  const labels = getDictionary(locale).privateLabelData.trustPoints;

  return privateLabelTrustPoints.map((point, index) => ({
    ...point,
    label: labels[index] ?? point.label,
  }));
}

export function getPrivateLabelServices(locale: Locale = defaultLocale): PrivateLabelService[] {
  const services = getDictionary(locale).privateLabelData.services;

  return privateLabelServices.map((service, index) => ({
    ...service,
    title: services[index]?.title ?? service.title,
    description: services[index]?.description ?? service.description,
  }));
}

export function getPrivateLabelProcessSteps(
  locale: Locale = defaultLocale,
): PrivateLabelProcessStep[] {
  const steps = getDictionary(locale).privateLabelData.process;

  return privateLabelProcessSteps.map((step, index) => ({
    ...step,
    title: steps[index]?.title ?? step.title,
    description: steps[index]?.description ?? step.description,
  }));
}

export function getPrivateLabelCategories(
  locale: Locale = defaultLocale,
): PrivateLabelCategoryDetail[] {
  const categoryDescriptions = getDictionary(locale).privateLabelData.categories;

  return privateLabelCategories.map((category) => ({
    ...category,
    description: categoryDescriptions[category.category],
  }));
}
