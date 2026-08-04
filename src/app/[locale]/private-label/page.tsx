import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivateLabelPage from "@/app/private-label/page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).pages.privateLabel;
  return localizedPageMetadata({
    locale,
    path: "/private-label",
    title: copy.heroTitle,
    description: copy.heroDescription,
  });
}

export default PrivateLabelPage;
