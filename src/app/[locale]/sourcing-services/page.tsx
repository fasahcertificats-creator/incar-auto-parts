import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTAButton } from "@/components/CTAButton";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPageMetadata } from "@/lib/seo";

type SourcingServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: SourcingServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).pages.sourcingServices;

  return localizedPageMetadata({
    locale,
    path: "/sourcing-services",
    absoluteTitle:
      locale === "ar"
        ? "توريد قطع غيار السيارات من الصين إلى الشرق الأوسط | INCAR"
        : "Auto Parts Sourcing from China for the Middle East | INCAR",
    title: copy.title,
    description: copy.description,
  });
}

export default async function SourcingServicesPage({
  params,
}: SourcingServicesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).pages.sourcingServices;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title={copy.scopeTitle}
            description={copy.scopeDescription}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.scopeItems.map((item) => (
              <article key={item} className="incar-card rounded-lg p-6">
                <p className="text-sm leading-7 text-metallic-silver">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          <article className="incar-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.qualityTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{copy.qualityDescription}</p>
          </article>
          <article className="incar-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white">{copy.exportTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{copy.exportDescription}</p>
          </article>
        </div>
      </section>
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="incar-card-elevated mx-auto max-w-4xl rounded-lg p-7 text-white">
          <h2 className="text-2xl font-semibold">{copy.statusTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-metallic-silver">
            {copy.statusDescription}
          </p>
          <CTAButton href="/parts" variant="secondary" className="mt-6">
            {copy.partsAction}
          </CTAButton>
        </div>
      </section>
    </>
  );
}
