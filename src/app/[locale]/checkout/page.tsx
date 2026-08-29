import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutFlow } from "@/features/cart/components/CheckoutFlow";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).checkout;
  return localizedPageMetadata({
    locale,
    path: "/checkout",
    title: copy.title,
    description: copy.contact.title,
    noindex: true,
  });
}

export default async function LocalizedCheckoutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CheckoutFlow />;
}
