import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import type { Locale } from "@/i18n/types";
import { absoluteSiteUrl } from "./site-url";

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

type LocalizedPageMetadataOptions = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  noindex?: boolean;
};

export function localizedPageMetadata({
  locale,
  path = "",
  title,
  description,
  noindex = false,
}: LocalizedPageMetadataOptions): Metadata {
  const normalizedPath = path && path !== "/" ? path : "";
  const arUrl = absoluteSiteUrl(`/ar${normalizedPath}`);
  const enUrl = absoluteSiteUrl(`/en${normalizedPath}`);
  const canonical = locale === "ar" ? arUrl : enUrl;

  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical,
      languages: {
        ar: arUrl,
        en: enUrl,
        "x-default": arUrl,
      },
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      type: "website",
      siteName,
      url: canonical,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      images: [absoluteSiteUrl("/images/hero-sourcing.png")],
    },
  };
}
