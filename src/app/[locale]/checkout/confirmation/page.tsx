import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutConfirmation } from "@/features/cart/components/CheckoutConfirmation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).checkout.confirmation;
  return localizedPageMetadata({
    locale,
    path: "/checkout/confirmation",
    title: copy.title,
    description: copy.description,
    noindex: true,
  });
}

export default async function CheckoutConfirmationPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CheckoutConfirmation />;
}
