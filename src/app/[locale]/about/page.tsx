import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutPage from "@/app/about/page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).pages.about;
  return localizedPageMetadata({
    locale,
    path: "/about",
    title: copy.title,
    description: copy.description,
  });
}

export default AboutPage;
