import { PageHero } from "@/components/PageHero";
import { RFQForm } from "@/features/rfq/components/RFQForm";
import { RFQList } from "@/features/rfq/components/RFQList";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Request for Quotation",
  "Submit an RFQ for wholesale auto parts sourcing from China to Saudi Arabia, including product list, quantity, Excel upload, and WhatsApp contact.",
);

export default async function RfqPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dictionary.pages.rfq.eyebrow}
        title={dictionary.pages.rfq.title}
        description={dictionary.pages.rfq.description}
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <RFQList />
          <div className="grid gap-5">
            <div className="incar-card-elevated rounded-lg p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                {dictionary.pages.rfq.reviewEyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {dictionary.pages.rfq.reviewTitle}
              </h2>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-muted">
                {dictionary.pages.rfq.notes.map((note) => (
                  <p key={note} className="border-s-2 border-primary/70 ps-3">
                    {note}
                  </p>
                ))}
              </div>
            </div>
            <RFQForm />
          </div>
        </div>
      </section>
    </>
  );
}
