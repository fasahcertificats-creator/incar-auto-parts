import { FinalCTA } from "@/components/FinalCTA";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getLocalizedTrustPillars,
  getTrustProcessSteps,
} from "@/data/trust";
import { TrustPillarsGrid, TrustProcess } from "@/features/trust/components";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About Us",
  "About INCAR AUTO PARTS, a China-based sourcing partner for Saudi and UAE wholesale auto parts buyers.",
);

export default async function AboutPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const trustPillars = getLocalizedTrustPillars(locale);
  const trustProcessSteps = getTrustProcessSteps(locale);

  return (
    <>
      <PageHero
        eyebrow={dictionary.pages.about.eyebrow}
        title={dictionary.pages.about.title}
        description={dictionary.pages.about.description}
        align="left"
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.about.trustEyebrow}
            title={dictionary.pages.about.trustTitle}
            description={dictionary.pages.about.trustDescription}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {dictionary.pages.about.narrative.map(({ title, copy }) => (
              <div key={title} className="incar-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{copy}</p>
              </div>
            ))}
            <div className="incar-card rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white">
                {dictionary.pages.about.journeyTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                {dictionary.pages.about.journeyCopy}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.about.pillarsEyebrow}
            title={dictionary.pages.about.pillarsTitle}
            description={dictionary.pages.about.pillarsDescription}
          />
          <div className="mt-10">
            <TrustPillarsGrid pillars={trustPillars} />
          </div>
        </div>
      </section>
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.about.workflowEyebrow}
            title={dictionary.pages.about.workflowTitle}
            description={dictionary.pages.about.workflowDescription}
          />
          <div className="mt-10">
            <TrustProcess steps={trustProcessSteps} />
          </div>
        </div>
      </section>
      <FinalCTA
        eyebrow={dictionary.pages.about.finalEyebrow}
        title={dictionary.pages.about.finalTitle}
        primaryHref="/contact"
        primaryLabel={dictionary.common.speakWithIncar}
        secondaryHref="/rfq"
        secondaryLabel={dictionary.common.requestQuotation}
      />
    </>
  );
}
