import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { RFQList } from "@/features/rfq/components/RFQList";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).pages.rfq;
  return localizedPageMetadata({
    locale,
    path: "/rfq",
    title: copy.title,
    description: copy.description,
    noindex: true,
  });
}

export default async function RfqWorkspacePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dictionary.pages.rfq.eyebrow}
        title={dictionary.pages.rfq.title}
        description={dictionary.pages.rfq.description}
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.7fr]">
          <RFQList />
          <aside id="upload-parts-list" className="incar-card-elevated rounded-lg p-6 text-white">
            <h2 className="text-2xl font-semibold">
              {dictionary.pages.rfq.draftStatusTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-metallic-silver">
              {dictionary.pages.rfq.draftStatusDescription}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
