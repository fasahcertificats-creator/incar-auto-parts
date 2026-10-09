import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { ProductCard } from "@/components/ProductCard";
import { getPublishedProducts } from "@/features/discovery/repository";
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
            ? "text-[13px] tracking-[0.05em]"
            : "text-[13px] uppercase tracking-[0.16em]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-semibold leading-[1.2] text-balance text-ink md:text-4xl md:leading-tight lg:text-5xl lg:text-wrap ${
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

const featureIcons = [
  // Pre-shipment QC — shield check
  <>
    <path d="M12 3.2 5 6v5.2c0 4.3 3 7.4 7 9.6 4-2.2 7-5.3 7-9.6V6Z" />
    <path d="m9.2 11.6 2 2 3.6-4" />
  </>,
  // Bilingual packaging — box
  <>
    <path d="M3.5 8.2 12 3.8l8.5 4.4v7.6L12 20.2l-8.5-4.4Z" />
    <path d="M3.5 8.2 12 12.6l8.5-4.4" />
    <path d="M12 12.6v7.6" />
  </>,
  // Trilingual communication — chat bubbles
  <>
    <path d="M4 5.5h11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-3.4 2.8a.6.6 0 0 1-1-.5V7.5a2 2 0 0 1 2-2Z" transform="translate(-0.6 0)" />
    <path d="M17.5 10H19a2 2 0 0 1 2 2v4.1a.6.6 0 0 1-1 .5L17.4 14H15" transform="translate(-1.2 1)" />
  </>,
  // Order follow-up — clipboard check
  <>
    <rect x="5" y="5" width="14" height="16" rx="2" />
    <path d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
    <path d="m9 13.5 2.2 2.2 4.3-4.7" />
  </>,
];

function FeatureIcon({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      {featureIcons[index % featureIcons.length]}
    </svg>
  );
}

const sourcingStepIcons = [
  // Specification & part review — clipboard with check
  <>
    <rect x="5" y="5" width="14" height="16" rx="2" />
    <path d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
    <path d="m9 13.5 2.2 2.2 4.3-4.7" />
  </>,
  // Production follow-up & quality inspection — magnifier with check
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20.5 20.5-4.6-4.6" />
    <path d="m8.4 11.1 1.8 1.8 3.3-3.7" />
  </>,
  // Packaging & order preparation — box
  <>
    <path d="M3.5 8.2 12 3.8l8.5 4.4v7.6L12 20.2l-8.5-4.4Z" />
    <path d="M3.5 8.2 12 12.6l8.5-4.4" />
    <path d="M12 12.6v7.6" />
  </>,
];

function SourcingStepIcon({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 md:size-6"
    >
      {sourcingStepIcons[index % sourcingStepIcons.length]}
    </svg>
  );
}

const carMakes = [
  { key: "toyota", q: "TOYOTA", img: "/images/home/car-toyota.jpg" },
  { key: "lexus", q: "LEXUS", img: "/images/home/car-lexus.jpg" },
  { key: "nissan", q: "NISSAN", img: "/images/home/car-nissan.jpg" },
  { key: "mazda", q: "MAZDA", img: "/images/home/car-mazda.jpg" },
  { key: "chevrolet", q: "CHEVROLET", img: "/images/home/car-chevrolet.jpg" },
  { key: "buick", q: "BUICK", img: "/images/home/car-buick.jpg" },
  { key: "haima", q: "HAIMA", img: "/images/home/car-haima.jpg" },
  { key: "tesla", q: "TESLA", img: "/images/home/car-tesla.jpg" },
] as const;

export async function HomeFoundation() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const copy = dictionary.homeFoundation;
  const products = await getPublishedProducts();
  const isArabic = locale === "ar";

  const makeCounts = new Map(
    carMakes.map((make) => [
      make.key,
      products.filter((product) => product.name.en.toUpperCase().includes(make.q)).length,
    ]),
  );
  const withImages = products.filter((product) => product.images.length > 0);
  const mechProducts = withImages
    .filter((product) => product.category === "Steering Parts" || product.category === "Suspension Parts")
    .slice(0, 4);
  const bodyProducts = withImages
    .filter((product) => product.category === "Body Parts")
    .slice(0, 4);

  const promoCards = [
    {
      eyebrow: copy.upload.eyebrow,
      title: copy.upload.title,
      description: copy.upload.description,
      action: copy.upload.action,
      href: "/rfq/upload-list",
    },
    {
      eyebrow: copy.privateLabel.eyebrow,
      title: copy.privateLabel.title,
      description: copy.privateLabel.description,
      action: copy.privateLabel.action,
      href: "/private-label",
    },
    {
      eyebrow: copy.sourcing.eyebrow,
      title: copy.sourcing.title,
      description: copy.sourcing.description,
      action: copy.sourcing.action,
      href: "/sourcing-services",
    },
  ];

  return (
    <>
      {/* Hero — Marketo-style promo banner with the sourcing image */}
      <section className="relative overflow-hidden border-b border-border bg-surface px-4 py-10 text-ink sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-9 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-10">
          <div>
            <p
              className={`font-bold text-primary sm:text-sm ${
                isArabic
                  ? "text-[13px] tracking-[0.06em]"
                  : "text-[13px] uppercase tracking-[0.16em]"
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
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:items-center sm:gap-3">
              <form action={localizeHref(locale, "/parts")} className="flex min-w-0 flex-1 items-stretch sm:max-w-md" role="search">
                <label htmlFor="home-part-search" className="sr-only">
                  {copy.search.label}
                </label>
                <input
                  id="home-part-search"
                  name="q"
                  dir="auto"
                  placeholder={copy.search.placeholder}
                  className="min-h-12 w-full min-w-0 rounded-s-md border border-e-0 border-border bg-white px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-primary"
                />
                <button
                  type="submit"
                  className="incar-focus min-h-12 shrink-0 rounded-e-md bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
                >
                  {copy.search.action}
                </button>
              </form>
              <CTAButton href="/rfq" variant="secondary" className="min-h-12">
                {copy.search.rfq}
              </CTAButton>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border shadow-[0_24px_60px_rgba(22,24,29,0.14)]">
            <Image
              src="/images/hero-sourcing.webp"
              alt={copy.search.title}
              width={1693}
              height={929}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature strip — Marketo's icon feature row */}
      <section className="border-b border-border bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {copy.features.items.map((feature, index) => (
            <div key={feature.title} className="flex items-start gap-3.5">
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/[0.07] text-primary">
                <FeatureIcon index={index} />
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-ink">{feature.title}</h3>
                <p className="mt-1 text-[13px] leading-6 text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by car — Garaze-style category tiles, the car IS the category */}
      <section className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.cars.eyebrow}
            title={copy.cars.title}
            description={copy.cars.description}
          />
          <div className="mt-4 grid grid-cols-2 gap-3.5 sm:mt-8 sm:gap-5 lg:grid-cols-4">
            {carMakes.map((make) => (
              <Link
                key={make.key}
                href={localizeHref(locale, `/parts?q=${make.q}`)}
                className="incar-focus incar-card group relative block overflow-hidden rounded-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
                  <Image
                    src={make.img}
                    alt={copy.cars.makes[make.key]}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,27,38,0)_45%,rgba(19,27,38,0.82))]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 sm:p-4">
                  <h3 className="text-lg font-bold text-white sm:text-xl">
                    {copy.cars.makes[make.key]}
                  </h3>
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white sm:text-xs">
                    {copy.cars.partsCount.replace("{count}", String(makeCounts.get(make.key) ?? 0))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers — mechanical parts (steering & suspension) with banner card */}
      <section className="bg-surface px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-5 lg:grid-cols-[280px_1fr]">
          <article className="incar-card relative flex min-h-56 flex-col justify-end overflow-hidden rounded-lg p-5 sm:p-6">
            <Image
              src="/images/home/banner-mechanical.jpg"
              alt={copy.showcaseMech.title}
              fill
              sizes="(min-width: 1024px) 280px, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,27,38,0.25),rgba(19,27,38,0.9))]" />
            <div className="relative">
              <p className={`text-[12px] font-bold text-primary ${isArabic ? "" : "uppercase tracking-[0.12em]"}`}>
                {copy.showcaseMech.eyebrow}
              </p>
              <h3 className="mt-1.5 text-xl font-bold text-white">{copy.showcaseMech.title}</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-white/75">{copy.showcaseMech.description}</p>
              <Link
                href={localizeHref(locale, "/parts?q=LS-")}
                className="incar-focus mt-4 inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-[13px] font-bold text-white transition hover:bg-primary-hover"
              >
                {copy.showcaseMech.viewAll}
              </Link>
            </div>
          </article>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {mechProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Exterior accessories — body parts with banner card */}
      <section className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-5 lg:grid-cols-[1fr_280px]">
          <div className="order-2 grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 lg:order-1">
            {bodyProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <article className="incar-card relative order-1 flex min-h-56 flex-col justify-end overflow-hidden rounded-lg p-5 sm:p-6 lg:order-2">
            <Image
              src="/images/home/banner-exterior.jpg"
              alt={copy.showcaseBody.title}
              fill
              sizes="(min-width: 1024px) 280px, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,27,38,0.25),rgba(19,27,38,0.9))]" />
            <div className="relative">
              <p className={`text-[12px] font-bold text-primary ${isArabic ? "" : "uppercase tracking-[0.12em]"}`}>
                {copy.showcaseBody.eyebrow}
              </p>
              <h3 className="mt-1.5 text-xl font-bold text-white">{copy.showcaseBody.title}</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-white/75">{copy.showcaseBody.description}</p>
              <Link
                href={localizeHref(locale, "/parts?q=BH-")}
                className="incar-focus mt-4 inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-[13px] font-bold text-white transition hover:bg-primary-hover"
              >
                {copy.showcaseBody.viewAll}
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Services promo banners — Marketo's offer cards, adapted to INCAR services */}
      <section className="bg-surface px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-5 md:grid-cols-3">
          {promoCards.map((card) => (
            <article
              key={card.href}
              className="incar-card flex flex-col rounded-lg p-5 sm:p-7"
            >
              <p className={`text-[12px] font-bold text-primary ${isArabic ? "" : "uppercase tracking-[0.12em]"}`}>
                {card.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-snug text-ink">
                {card.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                {card.description}
              </p>
              <Link
                href={localizeHref(locale, card.href)}
                className="incar-focus mt-5 inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                {card.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Manufacturing & quality steps */}
      <section className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.sourcing.eyebrow}
            title={copy.sourcing.title}
            description={copy.sourcing.description}
          />
          <ol className="mt-4 border-y border-border bg-surface/60 sm:mt-8 md:grid md:grid-cols-3 md:gap-4 md:border-0 md:bg-transparent">
            {copy.sourcing.items.map((item, index) => (
              <li
                key={item}
                className="flex min-h-12 items-center gap-3 border-b border-border px-2 py-2.5 last:border-b-0 md:block md:min-h-0 md:rounded-lg md:border md:bg-surface-elevated md:p-5 md:shadow-[0_10px_30px_rgba(22,24,29,0.07)] md:last:border-b"
              >
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/35 bg-primary/[0.07] text-primary md:mb-4 md:size-11">
                  <SourcingStepIcon index={index} />
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

      {/* Trust band — navy contrast section */}
      <section className="bg-navy px-4 py-10 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl md:max-w-3xl">
            <p
              className={`mb-1.5 font-bold text-primary ${
                isArabic
                  ? "text-[13px] tracking-[0.05em]"
                  : "text-[13px] uppercase tracking-[0.16em]"
              }`}
            >
              {copy.trust.eyebrow}
            </p>
            <h2
              className={`font-semibold leading-[1.2] text-balance text-white md:text-4xl md:leading-tight lg:text-5xl lg:text-wrap ${
                isArabic ? "text-[20px]" : "text-[21px]"
              }`}
            >
              {copy.trust.title}
            </h2>
            <p className="mt-2.5 text-[15px] leading-[1.65] text-white/70 sm:mt-4 sm:text-base sm:leading-7 md:text-lg">
              {copy.trust.description}
            </p>
          </div>
          <Link
            href={localizeHref(locale, "/about")}
            className="incar-focus inline-flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm font-semibold text-white/80 transition hover:text-white md:min-h-12 md:justify-center md:rounded-md md:border md:border-white/25 md:px-5 md:py-3 md:hover:border-white/50"
          >
            <span>{copy.trust.action}</span>
            <span aria-hidden="true" className="md:hidden">{isArabic ? "←" : "→"}</span>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-surface px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-border bg-surface-elevated p-5 shadow-[0_14px_40px_rgba(22,24,29,0.08)] sm:p-7 md:p-10">
          <HomeSectionHeader
            isArabic={isArabic}
            eyebrow={copy.ready.eyebrow}
            title={copy.ready.title}
            description={copy.ready.description}
          />
          <div className="mt-4 flex flex-col items-start gap-2 sm:mt-7 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={localizeHref(locale, "/rfq")}
              className="incar-focus inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(215,25,32,0.28)] transition hover:bg-primary-hover sm:w-auto"
            >
              {copy.search.rfq}
            </Link>
            <Link
              href={localizeHref(locale, "/rfq/upload-list")}
              className="incar-focus inline-flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm font-semibold text-metallic-silver transition hover:text-ink md:min-h-12 md:justify-center md:rounded-md md:border md:border-border md:bg-surface-elevated md:px-5 md:py-3 md:hover:border-metallic-silver/45"
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
