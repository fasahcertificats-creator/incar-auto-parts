import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import { CTAButton } from "./CTAButton";

export function Hero({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="relative isolate overflow-hidden bg-background text-white">
      <Image
        src="/images/hero-sourcing.png"
        alt="INCAR AUTO PARTS sourcing desk and export-ready auto parts"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover opacity-28 grayscale contrast-110"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_24%,rgba(199,204,209,0.14),transparent_28%),radial-gradient(circle_at_22%_82%,rgba(215,25,32,0.14),transparent_22%),linear-gradient(90deg,#070707_0%,rgba(7,7,7,0.96)_43%,rgba(7,7,7,0.68)_100%)]" />
      <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl content-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-metallic-silver">
            {dictionary.hero.eyebrow}
          </p>
          <h1 className="metallic-text text-4xl font-semibold leading-[1.15] md:text-6xl lg:text-7xl">
            {dictionary.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-metallic-silver md:text-xl">
            {dictionary.hero.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/rfq">{dictionary.hero.primary}</CTAButton>
            <CTAButton href="/products" variant="secondary">
              {dictionary.hero.tertiary}
            </CTAButton>
            <CTAButton
              href="/private-label#private-label-inquiry"
              variant="secondary"
            >
              {dictionary.hero.secondary}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
