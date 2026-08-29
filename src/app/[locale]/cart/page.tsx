import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartPage } from "@/features/cart/components/CartPage";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).cart.page;
  return localizedPageMetadata({
    locale,
    path: "/cart",
    title: copy.title,
    description: copy.description,
    noindex: true,
  });
}

export default async function LocalizedCartPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CartPage />;
}
