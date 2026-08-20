import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPage from "@/app/contact/page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).pages.contact;
  return localizedPageMetadata({
    locale,
    path: "/contact",
    title: copy.title,
    description: copy.description,
  });
}

export default ContactPage;
