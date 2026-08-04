import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getEligibleModelsForMake,
  getPublishedMakes,
} from "@/features/discovery/repository";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { getServerLocale } from "@/i18n/server";

export async function HomeFoundation() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.homeFoundation;
  const makes = getPublishedMakes();

  return (
    <>
      <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {copy.search.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              {copy.search.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-metallic-silver">
              {copy.search.description}
            </p>
          </div>
          <div className="incar-card rounded-lg p-5 md:p-7">
            <form action={localizeHref(locale, "/parts")} className="grid gap-3">
              <label htmlFor="home-part-search" className="text-sm font-semibold text-white">
                {copy.search.label}
              </label>
              <input
                id="home-part-search"
                name="q"
                dir="ltr"
                placeholder={copy.search.placeholder}
                className="incar-input px-4 text-sm"
              />
              <button
                type="submit"
                className="incar-focus min-h-12 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                {copy.search.action}
              </button>
            </form>
            <CTAButton href="/rfq" variant="secondary" className="mt-3 w-full">
              {copy.search.rfq}
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={copy.browse.eyebrow}
            title={copy.browse.title}
            description={copy.browse.description}
          />
          {makes.length ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {makes.map((make) => (
                <article key={make.id} className="incar-card rounded-lg p-6">
                  {make.isSampleData ? (
                    <p className="mb-3 text-xs font-semibold text-metallic-silver">
                      {dictionary.discovery.sampleNotice}
                    </p>
                  ) : null}
                  <Link
                    href={localizeHref(locale, `/parts/${make.slug}`)}
                    className="incar-focus rounded-sm text-2xl font-semibold text-white hover:text-metallic-silver"
                  >
                    {make.name}
                  </Link>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {getEligibleModelsForMake(make.id).map((model) => (
                      <Link
                        key={model.id}
                        href={localizeHref(locale, `/parts/${make.slug}/${model.slug}`)}
                        className="incar-focus inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
                      >
                        {model.name}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-metallic-silver/25 bg-background p-7">
              <h2 className="text-xl font-semibold text-white">{copy.browse.emptyTitle}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                {copy.browse.emptyDescription}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            eyebrow={copy.upload.eyebrow}
            title={copy.upload.title}
            description={copy.upload.description}
          />
          <CTAButton href="/rfq#upload-parts-list" variant="secondary">
            {copy.upload.action}
          </CTAButton>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={copy.sourcing.eyebrow}
            title={copy.sourcing.title}
            description={copy.sourcing.description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.sourcing.items.map((item) => (
              <article key={item} className="incar-card rounded-lg p-5 text-white">
                <p className="text-sm leading-7 text-metallic-silver">{item}</p>
              </article>
            ))}
          </div>
          <CTAButton href="/sourcing-services" variant="secondary" className="mt-7">
            {copy.sourcing.action}
          </CTAButton>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            eyebrow={copy.privateLabel.eyebrow}
            title={copy.privateLabel.title}
            description={copy.privateLabel.description}
          />
          <CTAButton href="/private-label">{copy.privateLabel.action}</CTAButton>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            eyebrow={copy.trust.eyebrow}
            title={copy.trust.title}
            description={copy.trust.description}
          />
          <CTAButton href="/about" variant="secondary">{copy.trust.action}</CTAButton>
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="incar-card-elevated mx-auto max-w-7xl rounded-lg p-7 md:p-10">
          <SectionHeader
            eyebrow={copy.ready.eyebrow}
            title={copy.ready.title}
            description={copy.ready.description}
          />
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/rfq">{copy.search.rfq}</CTAButton>
            <CTAButton href="/parts" variant="secondary">{copy.search.action}</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
