import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import {
  getEligibleModelsForMake,
  getPublishedMakes,
} from "@/features/discovery/repository";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { getServerLocale } from "@/i18n/server";

type HomeSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  isArabic: boolean;
};

function HomeSectionHeader({
  eyebrow,
  title,
  description,
  isArabic,
}: HomeSectionHeaderProps) {
  return (
    <div className="max-w-2xl md:max-w-3xl">
      <p
        className={`mb-1.5 font-bold text-primary ${
          isArabic
            ? "text-[10px] tracking-[0.05em]"
            : "text-[11px] uppercase tracking-[0.14em]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-semibold leading-[1.2] text-balance text-white md:text-4xl md:leading-tight lg:text-5xl lg:text-wrap ${
          isArabic ? "text-[20px]" : "text-[21px]"
        }`}
      >
        {title}
      </h2>
      <p className="mt-2.5 text-[15px] leading-[1.65] text-muted sm:mt-4 sm:text-base sm:leading-7 md:text-lg">
        {description}
      </p>
    </div>
  );
}

export async function HomeFoundation() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.homeFoundation;
  const makes = await getPublishedMakes();
  const modelsByMake = await Promise.all(makes.map((make) => getEligibleModelsForMake(make.id)));
  const isArabic = locale === "ar";

  return (
    <>
      <section className="relative overflow-hidden border-b border-metallic-silver/10 bg-background px-4 py-10 text-white sm:px-6 sm:py-16 lg:border-b-0 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-metallic-silver/20 to-transparent lg:hidden" />
        <div className="mx-auto grid max-w-7xl gap-5 sm:gap-9 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-10">
          <div>
            <p
              className={`font-bold text-primary sm:text-sm ${
                isArabic
                  ? "text-[10px] tracking-[0.06em]"
                  : "text-[11px] uppercase tracking-[0.16em]"
              }`}
            >
              {copy.search.eyebrow}
            </p>
            <h1 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight text-balance sm:mt-4 sm:text-wrap md:text-5xl">
              {copy.search.title}
            </h1>
            <p className="mt-2.5 max-w-xl text-[15px] leading-[1.6] text-metallic-silver sm:mt-5 sm:max-w-2xl sm:text-lg sm:leading-8">
              {copy.search.description}
            </p>
          </div>
          <div className="incar-card relative overflow-hidden rounded-lg p-4 sm:p-5 md:p-7">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/80 via-primary/35 to-transparent lg:hidden" />
            <form action={localizeHref(locale, "/parts")} className="grid gap-3">
              <label htmlFor="home-part-search" className="text-[14px] font-semibold leading-5 text-white sm:text-sm sm:leading-6">
                {copy.search.label}
              </label>
              <input
                id="home-part-search"
                name="q"
                dir="ltr"
                placeholder={copy.search.placeholder}
                className="incar-input px-4 text-base sm:text-sm"
              />
              <button
                type="submit"
                className="incar-focus min-h-12 rounded-md bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover sm:font-semibold"
              >
                {copy.search.action}
              </button>
            </form>
            <CTAButton href="/rfq" variant="secondary" className="mt-2.5 w-full">
              {copy.search.rfq}
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.browse.eyebrow}
            title={copy.browse.title}
            description={copy.browse.description}
          />
          {makes.length ? (
            <div className="mt-4 grid gap-3.5 sm:mt-8 sm:gap-5 lg:grid-cols-2">
              {makes.map((make, index) => (
                <article key={make.id} className="incar-card rounded-lg p-4 sm:p-6">
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
                  <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-2">
                    {modelsByMake[index].map((model) => (
                      <Link
                        key={model.id}
                        href={localizeHref(locale, `/parts/${make.slug}/${model.slug}`)}
                        className="incar-focus inline-flex min-h-11 items-center rounded-md border border-border bg-background/30 px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/35 hover:text-white lg:bg-transparent"
                      >
                        {model.name}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-metallic-silver/15 bg-background/50 p-4 sm:mt-8 sm:bg-background sm:p-7">
              <h2 className="text-base font-semibold leading-6 text-white sm:text-xl sm:leading-7">{copy.browse.emptyTitle}</h2>
              <p className="mt-1.5 max-w-3xl text-[14px] leading-6 text-muted sm:mt-2 sm:text-sm sm:leading-7">
                {copy.browse.emptyDescription}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.upload.eyebrow}
            title={copy.upload.title}
            description={copy.upload.description}
          />
          <CTAButton href="/rfq#upload-parts-list" variant="secondary" className="w-fit">
            {copy.upload.action}
          </CTAButton>
        </div>
      </section>

      <section className="bg-surface px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.sourcing.eyebrow}
            title={copy.sourcing.title}
            description={copy.sourcing.description}
          />
          <ol className="mt-4 border-y border-metallic-silver/10 bg-background/30 sm:mt-8 md:grid md:grid-cols-3 md:gap-4 md:border-0 md:bg-transparent">
            {copy.sourcing.items.map((item, index) => (
              <li
                key={item}
                className="flex min-h-12 items-center gap-3 border-b border-metallic-silver/10 px-2 py-2.5 last:border-b-0 md:block md:min-h-0 md:rounded-lg md:border md:border-border md:bg-surface-elevated/45 md:p-5 md:shadow-[0_22px_64px_rgba(0,0,0,0.24)] md:last:border-b"
              >
                <span aria-hidden="true" className="shrink-0 font-mono text-[10px] font-bold tracking-[0.12em] text-primary/80 md:hidden">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[14px] leading-6 text-metallic-silver md:text-sm md:leading-7">
                  {item}
                </p>
              </li>
            ))}
          </ol>
          <CTAButton href="/sourcing-services" variant="secondary" className="mt-4 w-fit sm:mt-7">
            {copy.sourcing.action}
          </CTAButton>
        </div>
      </section>

      <section className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-lg border border-metallic-silver/12 bg-surface-elevated/55 p-5 sm:gap-8 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.privateLabel.eyebrow}
            title={copy.privateLabel.title}
            description={copy.privateLabel.description}
          />
          <Link
            href={localizeHref(locale, "/private-label")}
            className="incar-focus inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] transition hover:bg-primary-hover"
          >
            {copy.privateLabel.action}
          </Link>
        </div>
      </section>

      <section className="bg-surface px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.trust.eyebrow}
            title={copy.trust.title}
            description={copy.trust.description}
          />
          <Link
            href={localizeHref(locale, "/about")}
            className="incar-focus inline-flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm font-semibold text-metallic-silver transition hover:text-white md:min-h-12 md:justify-center md:rounded-md md:border md:border-border md:bg-surface-elevated md:px-5 md:py-3 md:hover:border-metallic-silver/45 md:hover:bg-surface-muted"
          >
            <span>{copy.trust.action}</span>
            <span aria-hidden="true" className="md:hidden">{isArabic ? "←" : "→"}</span>
          </Link>
        </div>
      </section>

      <section className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-metallic-silver/15 bg-surface-elevated/80 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] sm:p-7 md:p-10">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.ready.eyebrow}
            title={copy.ready.title}
            description={copy.ready.description}
          />
          <div className="mt-4 flex flex-col items-start gap-2 sm:mt-7 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={localizeHref(locale, "/rfq")}
              className="incar-focus inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] transition hover:bg-primary-hover sm:w-auto"
            >
              {copy.search.rfq}
            </Link>
            <Link
              href={localizeHref(locale, "/rfq/upload-list")}
              className="incar-focus inline-flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm font-semibold text-metallic-silver transition hover:text-white md:min-h-12 md:justify-center md:rounded-md md:border md:border-border md:bg-surface-elevated md:px-5 md:py-3 md:hover:border-metallic-silver/45 md:hover:bg-surface-muted"
            >
              <span>{copy.upload.action}</span>
              <span aria-hidden="true" className="md:hidden">{isArabic ? "←" : "→"}</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
