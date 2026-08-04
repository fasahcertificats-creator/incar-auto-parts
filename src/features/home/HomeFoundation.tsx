import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { SectionHeader } from "@/components/SectionHeader";
import { getActiveBrands, getActiveVehicleModels } from "@/lib/products";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { getServerLocale } from "@/i18n/server";

export async function HomeFoundation() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.homeFoundation;
  const brands = getActiveBrands();

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
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {brands.map((brand) => (
              <article key={brand.id} className="incar-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white">{brand.displayName}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {getActiveVehicleModels(brand.name).map((model) => (
                    <Link
                      key={model.id}
                      href={localizeHref(
                        locale,
                        `/parts?brand=${encodeURIComponent(brand.name)}&model=${encodeURIComponent(model.name)}`,
                      )}
                      className="incar-focus inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-semibold text-metallic-silver hover:text-white"
                    >
                      {model.displayName}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
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
