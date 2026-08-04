import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import type { Locale } from "@/i18n/types";
import { absoluteSiteUrl } from "./site-url";

const siteName = brand.name;
const baseDescription =
  "Wholesale auto parts sourcing from China for auto parts wholesalers and importers across the Middle East, including part discovery, bulk request lists, sourcing, and private label coordination.";

export function pageMetadata(title: string, description = baseDescription): Metadata {
  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: [
      "auto parts sourcing China",
      "Middle East wholesale auto parts sourcing",
      "Toyota spare parts China",
      "Hyundai spare parts China",
      "private label auto parts",
      "OEM packaging auto parts",
      "INCAR AUTO PARTS",
      "China to Middle East B2B sourcing",
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
};

export function localizedPageMetadata({
  locale,
  path = "",
  title,
  absoluteTitle,
  description,
  noindex = false,
}: LocalizedPageMetadataOptions): Metadata {
  const normalizedPath = path && path !== "/" ? path : "";
  const arUrl = absoluteSiteUrl(`/ar${normalizedPath}`);
  const enUrl = absoluteSiteUrl(`/en${normalizedPath}`);
  const canonical = locale === "ar" ? arUrl : enUrl;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : `${title} | ${siteName}`,
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
      images: [absoluteSiteUrl("/images/hero-sourcing.png")],
    },
  };
}
