import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/app/page";
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
        ? "INCAR | توريد قطع غيار السيارات بالجملة إلى الشرق الأوسط"
        : "INCAR | Wholesale Auto Parts Sourcing for the Middle East",
    title: dictionary.hero.title,
    description: dictionary.hero.description,
  });
}

export default Home;
