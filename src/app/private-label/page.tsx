import { SectionHeader } from "@/components/SectionHeader";
import {
  getPrivateLabelCategories,
  getPrivateLabelProcessSteps,
  getPrivateLabelServices,
  getPrivateLabelTrustPoints,
} from "@/data/private-label";
import { getTrustPillarsBySlug } from "@/data/trust";
import {
  PrivateLabelCategoryCard,
  PrivateLabelFinalCTA,
  PrivateLabelHero,
  PrivateLabelInquiryForm,
  PrivateLabelProcessSteps,
  PrivateLabelQualitySection,
  PrivateLabelServiceCard,
} from "@/features/private-label/components";
import { TrustProofPoints } from "@/features/trust/components";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Private Label Auto Parts for Middle Eastern Markets",
  "Develop Private Label auto parts with managed product specifications, packaging, labels, production, and agreed quality inspection.",
);

export default async function PrivateLabelPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const privateLabelTrustPoints = getPrivateLabelTrustPoints(locale);
  const privateLabelServices = getPrivateLabelServices(locale);
  const privateLabelProcessSteps = getPrivateLabelProcessSteps(locale);
  const privateLabelCategories = getPrivateLabelCategories(locale);
  const privateLabelTrustPillars = getTrustPillarsBySlug(
    [
      "packaging-control",
      "quality-inspection-system",
      "factory-verification",
      "export-documentation",
      "middle-east-market-focus",
    ],
    locale,
  );

  return (
    <>
      <PrivateLabelHero
        trustPoints={privateLabelTrustPoints}
        dictionary={dictionary}
      />

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.whyEyebrow}
            title={dictionary.pages.privateLabel.whyTitle}
            description={dictionary.pages.privateLabel.whyDescription}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {dictionary.pages.privateLabel.reasons.map((reason, index) => (
              <article key={reason} className="incar-card-elevated rounded-lg p-5">
                <span className="text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-sm leading-6 text-metallic-silver">
                  {reason}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.scopeEyebrow}
            title={dictionary.pages.privateLabel.scopeTitle}
            description={dictionary.pages.privateLabel.scopeDescription}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {privateLabelServices.map((service) => (
              <PrivateLabelServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.processEyebrow}
            title={dictionary.pages.privateLabel.processTitle}
            description={dictionary.pages.privateLabel.processDescription}
          />
          <div className="mt-10">
            <PrivateLabelProcessSteps steps={privateLabelProcessSteps} />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.categoriesEyebrow}
            title={dictionary.pages.privateLabel.categoriesTitle}
            description={dictionary.pages.privateLabel.categoriesDescription}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {privateLabelCategories.map((category) => (
              <PrivateLabelCategoryCard
                key={category.category}
                category={category}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.packagingEyebrow}
            title={dictionary.pages.privateLabel.packagingTitle}
            description={dictionary.pages.privateLabel.packagingDescription}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {dictionary.pages.privateLabel.packagingDetails.map((detail) => (
              <div key={detail} className="incar-card rounded-lg p-5">
                <p className="font-semibold text-white">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.trustEyebrow}
            title={dictionary.pages.privateLabel.trustTitle}
            description={dictionary.pages.privateLabel.trustDescription}
          />
          <div className="mt-10">
            <TrustProofPoints pillars={privateLabelTrustPillars} />
          </div>
        </div>
      </section>

      <PrivateLabelQualitySection dictionary={dictionary} />

      <section
        id="private-label-inquiry"
        className="bg-surface px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.inquiryEyebrow}
            title={dictionary.pages.privateLabel.inquiryTitle}
            description={dictionary.pages.privateLabel.inquiryDescription}
          />
          <PrivateLabelInquiryForm />
        </div>
      </section>

      <PrivateLabelFinalCTA dictionary={dictionary} />
    </>
  );
}
