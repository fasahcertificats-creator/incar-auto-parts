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
    title: dictionary.hero.title,
    description: dictionary.hero.description,
  });
}

export default Home;
