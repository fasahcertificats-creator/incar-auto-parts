import Link from "next/link";
import { CatalogCard } from "@/components/CatalogCard";
import { CTAButton } from "@/components/CTAButton";
import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { PrivateLabelSection } from "@/components/PrivateLabelSection";
import { ProcessSection } from "@/components/ProcessSection";
import { SectionHeader } from "@/components/SectionHeader";
import { getLocalizedCatalogs } from "@/data/catalogs";
import { getPrivateLabelServices } from "@/data/private-label";
import { getLocalizedTrustPillars } from "@/data/trust";
import { TrustSection } from "@/features/trust/components";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";

export { HomeFoundation as default } from "@/features/home/HomeFoundation";

// Retained temporarily so the pre-Sprint homepage can be compared during review.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function LegacyHome() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const trustPillars = getLocalizedTrustPillars(locale);
  const catalogs = getLocalizedCatalogs(locale);
  const privateLabelServices = getPrivateLabelServices(locale);

  return (
    <>
      <Hero dictionary={dictionary} />
      <TrustSection
        eyebrow={dictionary.home.trust.eyebrow}
        title={dictionary.home.trust.title}
        description={dictionary.home.trust.description}
        pillars={trustPillars}
        primaryCTA={{ label: dictionary.common.requestQuotation, href: "/rfq" }}
        secondaryCTA={{ label: dictionary.common.learnAboutIncar, href: "/about" }}
      />

      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow={dictionary.home.why.eyebrow}
            title={dictionary.home.why.title}
            description={dictionary.home.why.description}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {dictionary.home.why.reasons.map((reason, index) => (
              <div key={reason} className="incar-card-elevated rounded-lg p-6">
                <span className="text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-lg font-semibold leading-7 text-white">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={dictionary.home.services.eyebrow}
            title={dictionary.home.services.title}
            description={dictionary.home.services.description}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dictionary.home.services.items.map((service) => (
              <article
                key={service.title}
                className="incar-card flex h-full flex-col rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold text-white">
                  {service.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="incar-focus mt-5 inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
                >
                  {service.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PrivateLabelSection
        eyebrow={dictionary.privateLabelPreview.eyebrow}
        title={dictionary.privateLabelPreview.title}
        description={dictionary.privateLabelPreview.description}
        cta={dictionary.privateLabelPreview.cta}
        services={privateLabelServices}
      />

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionHeader
              eyebrow={dictionary.home.qualityPreview.eyebrow}
              title={dictionary.home.qualityPreview.title}
              description={dictionary.home.qualityPreview.description}
            />
            <CTAButton href="/quality-control" variant="ghost" className="mt-7">
              {dictionary.home.qualityPreview.cta}
            </CTAButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustPillars.slice(0, 4).map((pillar) => (
              <div key={pillar.id} className="incar-card rounded-lg p-5">
                <p className="text-lg font-semibold text-white">
                  {pillar.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {pillar.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection
        eyebrow={dictionary.processPreview.eyebrow}
        title={dictionary.processPreview.title}
        description={dictionary.processPreview.description}
        steps={dictionary.processPreview.steps.map((step) => ({ ...step }))}
      />

      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            eyebrow={dictionary.home.catalogsPreview.eyebrow}
            title={dictionary.home.catalogsPreview.title}
            description={dictionary.home.catalogsPreview.description}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {catalogs.slice(0, 4).map((catalog) => (
              <CatalogCard
                key={catalog.id}
                catalog={catalog}
                ctaLabel={dictionary.common.requestCatalog}
              />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        eyebrow={dictionary.home.finalCta.eyebrow}
        title={dictionary.home.finalCta.title}
        primaryHref="/rfq"
        primaryLabel={dictionary.common.requestQuotation}
        secondaryHref="/contact"
        secondaryLabel={dictionary.common.contactUs}
      />
    </>
  );
}
