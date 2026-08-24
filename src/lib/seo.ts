import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import type { Locale } from "@/i18n/types";
import { absoluteSiteUrl } from "./site-url";

const siteName = brand.name;
const baseDescription =
  "Explore INCAR auto parts products by Part Number or OEM Reference, request wholesale quotations, and review manufacturing, quality, packaging, and Private Label capabilities.";

export function pageMetadata(title: string, description = baseDescription): Metadata {
  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: [
      "INCAR auto parts",
      "wholesale auto parts Middle East",
      "Toyota spare parts China",
      "Hyundai spare parts China",
      "private label auto parts",
      "private label packaging auto parts",
      "INCAR AUTO PARTS",
      "auto parts manufacturing and quality inspection",
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
  absoluteTitle?: string;
  description: string;
  noindex?: boolean;
  /** Absolute URL. Falls back to the site-wide hero image when omitted. */
  image?: string;
};

export function localizedPageMetadata({
  locale,
  path = "",
  title,
  absoluteTitle,
  description,
  noindex = false,
  image,
}: LocalizedPageMetadataOptions): Metadata {
  const normalizedPath = path && path !== "/" ? path : "";
  const arUrl = absoluteSiteUrl(`/ar${normalizedPath}`);
  const enUrl = absoluteSiteUrl(`/en${normalizedPath}`);
  const canonical = locale === "ar" ? arUrl : enUrl;

  return {
    title: { absolute: absoluteTitle ?? `${title} | ${siteName}` },
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
      title: absoluteTitle ?? `${title} | ${siteName}`,
      description,
      type: "website",
      siteName,
      url: canonical,
      locale,
      alternateLocale: locale === "ar" ? ["en"] : ["ar"],
      images: [image ?? absoluteSiteUrl("/images/hero-sourcing.png")],
    },
  };
}
