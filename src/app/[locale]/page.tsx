import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeFoundation } from "@/features/home/HomeFoundation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return localizedPageMetadata({
    locale,
    absoluteTitle:
      locale === "ar"
        ? "INCAR | قطع غيار لتجار الجملة والمستوردين"
        : "INCAR | Auto Parts for Wholesalers & Importers",
    title: dictionary.hero.title,
    description:
      locale === "ar"
        ? "استعرض قطع غيار INCAR وابحث برقم القطعة أو رقم OEM واطلب عرضًا، مع دعم التصنيع والجودة والتغليف والعلامة الخاصة."
        : "Explore INCAR auto parts by Part Number or OEM Reference, request a quotation, and review manufacturing, quality, packaging, and Private Label capabilities.",
  });
}

export default HomeFoundation;
