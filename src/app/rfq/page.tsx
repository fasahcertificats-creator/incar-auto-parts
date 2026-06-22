import { PageHero } from "@/components/PageHero";
import { RFQForm } from "@/features/rfq/components/RFQForm";
import { RFQList } from "@/features/rfq/components/RFQList";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Request for Quotation",
  "Submit an RFQ for wholesale auto parts sourcing from China to Saudi Arabia, including product list, quantity, Excel upload, and WhatsApp contact.",
);

const rfqTrustNotes = [
  "Your RFQ is reviewed by the INCAR sourcing team.",
  "Product information, quantities, and packaging notes are checked before supplier coordination.",
  "You can send part numbers, an Excel or CSV file, or products selected from the catalog.",
  "Communication can continue through WhatsApp or email after review.",
];

export default function RfqPage() {
  return (
    <>
      <PageHero
        eyebrow="RFQ"
        title="Request a professional wholesale quotation"
        description="Build an RFQ list from catalog products, add quantities, upload an Excel file, and send a wholesale sourcing request for China-to-Saudi supply."
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <RFQList />
          <div className="grid gap-5">
            <div className="incar-card-elevated rounded-lg p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                RFQ review support
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Submit with clear sourcing context.
              </h2>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-muted">
                {rfqTrustNotes.map((note) => (
                  <p key={note} className="border-l-2 border-primary/70 pl-3">
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
