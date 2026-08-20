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
  // Reduced from all 5 shared trust pillars to the 3 most directly relevant
  // to a Private Label buyer specifically; factory-verification and
  // middle-east-market-focus are more general/RFQ-flavored and already
  // covered implicitly by the Process and Categories sections below. This
  // only changes which of the shared pillars this page chooses to display —
  // the pillar data itself (used on Home/About/Quality Control) is untouched.
  const privateLabelTrustPillars = getTrustPillarsBySlug(
    ["packaging-control", "quality-inspection-system", "export-documentation"],
    locale,
  );

  return (
    <>
      <PrivateLabelHero
        trustPoints={privateLabelTrustPoints}
        dictionary={dictionary}
      />

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

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.whyEyebrow}
            title={dictionary.pages.privateLabel.whyTitle}
            description={dictionary.pages.privateLabel.whyDescription}
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
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.pages.privateLabel.trustEyebrow}
            title={dictionary.pages.privateLabel.trustTitle}
            description={dictionary.pages.privateLabel.trustDescription}
          />
          <div className="mt-10">
            <TrustProofPoints pillars={privateLabelTrustPillars} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dictionary.pages.privateLabel.qualityPoints.map((point) => (
              <div key={point} className="incar-card rounded-lg p-5">
                <p className="font-semibold text-white">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PrivateLabelFinalCTA dictionary={dictionary} />
    </>
  );
}
