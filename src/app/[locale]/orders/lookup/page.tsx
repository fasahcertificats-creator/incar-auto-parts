import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderLookupPage } from "@/features/cart/components/OrderLookupPage";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).ordersLookup;
  return localizedPageMetadata({
    locale,
    path: "/orders/lookup",
    title: copy.title,
    description: copy.description,
    noindex: true,
  });
}

export default async function LocalizedOrderLookupPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <OrderLookupPage />;
}
