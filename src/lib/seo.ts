import type { Metadata } from "next";
import { brand } from "@/lib/brand";

const siteName = brand.name;
const baseDescription =
  "China-based automotive sourcing, quality inspection, private label packaging, and export support for Saudi wholesale auto parts buyers.";

export function pageMetadata(title: string, description = baseDescription): Metadata {
  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: [
      "auto parts sourcing China",
      "Saudi Arabia wholesale auto parts",
      "Toyota spare parts China",
      "Hyundai spare parts China",
      "private label auto parts",
      "OEM packaging auto parts",
      "INCAR AUTO PARTS",
      "China to Saudi B2B sourcing",
    ],
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      type: "website",
      siteName,
      images: ["/images/hero-sourcing.png"],
    },
  };
}
