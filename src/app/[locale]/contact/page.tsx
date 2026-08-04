import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const copy = dictionary.pages.contact;
  const unavailable =
    locale === "ar"
      ? "سيتم نشر قنوات التواصل الرسمية هنا بعد اعتمادها. لا يتم إرسال أي نموذج من هذه الصفحة حاليًا."
      : "Verified contact channels will appear here after approval. No form is submitted from this page today.";

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="incar-card mx-auto max-w-3xl rounded-lg p-7 text-center text-metallic-silver">
          <p className="text-base leading-7">{unavailable}</p>
        </div>
      </section>
    </>
  );
}
