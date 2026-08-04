import type { SampleCategoryRecord } from "@/types/sample-product";

export const categories: SampleCategoryRecord[] = [
  {
    id: "brake-system",
    slug: "brake-system",
    name: "Brake System",
    displayName: "Brake System",
    description: "Brake pads, discs, and related service items for wholesale RFQ sourcing.",
    isActive: true,
  },
  {
    id: "suspension-parts",
    slug: "suspension-parts",
    name: "Suspension Parts",
    displayName: "Suspension Parts",
    description: "Shock absorbers, control arms, and chassis components for varied road-use requirements.",
    isActive: true,
  },
  {
    id: "filters",
    slug: "filters",
    name: "Filters",
    displayName: "Filters",
    description: "Air, cabin, and oil filter programs for high-volume purchasing teams.",
    isActive: true,
  },
  {
    id: "engine-parts",
    slug: "engine-parts",
    name: "Engine Parts",
    displayName: "Engine Parts",
    description: "Selected engine service and mounting parts for quotation-led sourcing.",
    isActive: true,
  },
  {
    id: "interior-parts",
    slug: "interior-parts",
    name: "Interior Parts",
    displayName: "Interior Parts",
    description: "Switches, handles, trim, and cabin items prepared for private label options.",
    isActive: true,
  },
];
