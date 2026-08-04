import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { ProductExplorer } from "@/components/ProductExplorer";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";
import type { BrandName } from "@/types/product";

type PartsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string | string[];
    brand?: string | string[];
    model?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parseBrand(value: string): BrandName | "All" {
  return value === "Toyota" || value === "Hyundai" ? value : "All";
}

export async function generateMetadata({ params }: PartsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return localizedPageMetadata({
    locale,
    path: "/parts",
    title: dictionary.pages.products.title,
    description: dictionary.pages.products.description,
  });
}

export default async function PartsPage({ params, searchParams }: PartsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const query = await searchParams;

  return (
    <>
      <PageHero
        eyebrow={dictionary.pages.products.eyebrow}
        title={dictionary.pages.products.title}
        description={dictionary.pages.products.description}
      />
      <ProductExplorer
        initialSearch={firstValue(query.q)}
        initialBrand={parseBrand(firstValue(query.brand))}
        initialModel={firstValue(query.model) || "All"}
      />
    </>
  );
}
