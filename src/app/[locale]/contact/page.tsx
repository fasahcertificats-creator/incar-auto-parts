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
      ? "قنوات التواصل الرسمية قيد التحديث. يمكنك الآن إرسال طلب عرض أو رفع قائمة القطع من المسارات المخصصة."
      : "Official contact channels are being updated. You can use Product RFQ or Upload Parts List now.";

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
