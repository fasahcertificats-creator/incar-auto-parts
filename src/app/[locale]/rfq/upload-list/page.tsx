import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { BulkListJourney } from "@/features/rfq/components/BulkListJourney";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).pages.bulkList;
  return localizedPageMetadata({
    locale,
    path: "/rfq/upload-list",
    title: copy.title,
    description: copy.description,
    noindex: true,
  });
}

export default async function BulkListPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).pages.bulkList;
  return <>
    <PageHero eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
    <BulkListJourney />
  </>;
}
