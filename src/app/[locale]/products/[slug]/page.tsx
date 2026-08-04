import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailsPage from "@/app/products/[slug]/page";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getActiveProducts, getProductBySlug } from "@/lib/products";
import { localizedPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getActiveProducts().map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProductBySlug(slug);
  const dictionary = getDictionary(locale);

  if (!product) {
    return localizedPageMetadata({
      locale,
      path: `/products/${slug}`,
      title: dictionary.pages.products.title,
      description: dictionary.pages.products.detailDescription,
      noindex: true,
    });
  }

  return localizedPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.name,
    description: dictionary.pages.products.detailDescription,
  });
}

export default async function LocalizedProductDetailsPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return ProductDetailsPage({ params: Promise.resolve({ slug }) });
}
