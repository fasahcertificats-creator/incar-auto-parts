import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { brand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Contact Us",
  "Choose the appropriate INCAR request path and provide your company and Middle Eastern target market details.",
);

export default async function ContactPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dictionary.pages.contact.eyebrow}
        title={dictionary.pages.contact.title}
        description={dictionary.pages.contact.description}
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="incar-card rounded-lg p-7 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
              {dictionary.pages.contact.details}
            </p>
            <div className="mt-8 grid gap-6">
              <div>
                <p className="text-sm text-muted">{dictionary.pages.contact.whatsapp}</p>
                <p className="mt-1 text-xl font-semibold">{brand.whatsapp}</p>
              </div>
              <div>
                <p className="text-sm text-muted">{dictionary.pages.contact.email}</p>
                <p className="mt-1 text-xl font-semibold">{brand.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted">{dictionary.pages.contact.office}</p>
                <p className="mt-1 text-xl font-semibold">{dictionary.brand.office}</p>
              </div>
              <div>
                <p className="text-sm text-muted">{dictionary.pages.contact.marketFocus}</p>
                <p className="mt-1 text-xl font-semibold">{dictionary.brand.market}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-3">
              <a
                href="https://wa.me/8613800000000"
                className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover"
                target="_blank"
                rel="noreferrer"
              >
                {dictionary.common.contactViaWhatsapp}
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
              >
                {dictionary.common.emailIncar}
              </a>
            </div>
            <div className="mt-8">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
                {dictionary.pages.contact.inquiryTypes}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-metallic-silver">
                {dictionary.pages.contact.types.map((item) => (
                  <span key={item} className="rounded-sm border border-border px-3 py-2">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">
                {dictionary.pages.contact.missingPart}
              </p>
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
