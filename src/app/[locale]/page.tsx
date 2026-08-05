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
        ? "INCAR | مورد قطع غيار السيارات من الصين إلى الشرق الأوسط"
        : "INCAR | Auto Parts Supplier from China for the Middle East",
    title: dictionary.hero.title,
    description:
      locale === "ar"
        ? "INCAR مورد متخصص لقطع غيار السيارات بالجملة، يخدم التجار والمستوردين في الشرق الأوسط بخبرة في القطع والتصنيع والفحص وإدارة التوريد من الصين."
        : "INCAR is a specialized B2B auto parts supplier serving wholesalers and importers across the Middle East with expertise in parts, manufacturing, inspection, and supply from China.",
  });
}

export default HomeFoundation;
