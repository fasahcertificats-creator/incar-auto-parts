import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getFutureTrustProofAssets,
  getTrustPillarsBySlug,
  getTrustProcessSteps,
} from "@/data/trust";
import {
  TrustFinalCTA,
  TrustPillarsGrid,
  TrustProcess,
  TrustProofPoints,
} from "@/features/trust/components";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Quality Control and Trust System",
  "INCAR manages order-specific manufacturing, inspection, quality-control, packaging, and supply checkpoints for auto parts wholesalers across the Middle East.",
);

export default async function QualityControlPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const qualityControlPillars = getTrustPillarsBySlug(
    [
      "quality-inspection-system",
      "factory-verification",
      "packaging-control",
      "export-documentation",
      "middle-east-market-focus",
      "china-advantage",
    ],
    locale,
  );
  const trustProcessSteps = getTrustProcessSteps(locale);
  const futureTrustProofAssets = getFutureTrustProofAssets(locale);

  return (
    <>
      <PageHero
        eyebrow={dictionary.pages.quality.eyebrow}
        title={dictionary.pages.quality.title}
        description={dictionary.pages.quality.description}
        align="left"
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.quality.foundationEyebrow}
            title={dictionary.pages.quality.foundationTitle}
            description={dictionary.pages.quality.foundationDescription}
          />
          <div className="mt-10">
            <TrustPillarsGrid pillars={qualityControlPillars} />
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.quality.workflowEyebrow}
            title={dictionary.pages.quality.workflowTitle}
            description={dictionary.pages.quality.workflowDescription}
          />
          <div className="mt-10">
            <TrustProcess steps={trustProcessSteps} />
          </div>
        </div>
      </section>

      {[
        {
          eyebrow: dictionary.pages.quality.inspectionEyebrow,
          title: dictionary.pages.quality.inspectionTitle,
          description: dictionary.pages.quality.inspectionDescription,
          items: dictionary.pages.quality.qualityWorkflow,
          elevated: false,
        },
        {
          eyebrow: dictionary.pages.quality.factoryEyebrow,
          title: dictionary.pages.quality.factoryTitle,
          description: dictionary.pages.quality.factoryDescription,
          items: dictionary.pages.quality.factoryApproach,
          elevated: true,
        },
        {
          eyebrow: dictionary.pages.quality.packagingEyebrow,
          title: dictionary.pages.quality.packagingTitle,
          description: dictionary.pages.quality.packagingDescription,
          items: dictionary.pages.quality.packagingControls,
          elevated: false,
        },
        {
          eyebrow: dictionary.pages.quality.exportEyebrow,
          title: dictionary.pages.quality.exportTitle,
          description: dictionary.pages.quality.exportDescription,
          items: dictionary.pages.quality.exportSupport,
          elevated: true,
        },
      ].map((section, index) => (
        <section
          key={section.eyebrow}
          className={`px-4 py-16 sm:px-6 lg:px-8 ${
            index % 2 === 0 ? "bg-background" : "bg-surface"
          }`}
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.84fr_1.16fr]">
            <SectionHeader
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {section.items.map((item) => (
                <article
                  key={item}
                  className={`rounded-lg p-5 ${
                    section.elevated ? "incar-card-elevated" : "incar-card"
                  }`}
                >
                  <p className="text-sm leading-6 text-muted">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.84fr_1.16fr]">
          <SectionHeader
            eyebrow={dictionary.pages.quality.marketEyebrow}
            title={dictionary.pages.quality.marketTitle}
            description={dictionary.pages.quality.marketDescription}
          />
          <div className="incar-card rounded-lg p-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {dictionary.pages.quality.boundariesEyebrow}
            </p>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
              {dictionary.pages.quality.boundaries.map((item) => (
                <li key={item} className="border-s-2 border-primary/70 ps-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.quality.proofEyebrow}
            title={dictionary.pages.quality.proofTitle}
            description={dictionary.pages.quality.proofDescription}
          />
          <div className="mt-10">
            <TrustProofPoints pillars={qualityControlPillars} />
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="incar-card-elevated rounded-lg p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {dictionary.pages.quality.futureEyebrow}
            </p>
            <p className="mt-4 max-w-4xl text-base leading-7 text-metallic-silver">
              {futureTrustProofAssets} {dictionary.pages.quality.futureSuffix}
            </p>
          </div>
        </div>
      </section>

      <TrustFinalCTA
        title={dictionary.pages.quality.finalTitle}
        description={dictionary.pages.quality.finalDescription}
        primaryLabel={dictionary.common.requestQuotation}
        primaryHref="/rfq"
        secondaryLabel={dictionary.common.learnAboutIncar}
        secondaryHref="/about"
      />
    </>
  );
}
