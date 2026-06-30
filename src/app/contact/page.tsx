import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { brand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Contact Us",
  "Contact INCAR AUTO PARTS by WhatsApp or email for China to Saudi Arabia wholesale auto parts RFQ support.",
);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the China sourcing desk"
        description="Send your RFQ, private label requirements, catalog request, or sourcing question. WhatsApp is the fastest route for urgent wholesale requests."
      />
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="incar-card rounded-lg p-7 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
              Contact details
            </p>
            <div className="mt-8 grid gap-6">
              <div>
                <p className="text-sm text-muted">WhatsApp</p>
                <p className="mt-1 text-xl font-semibold">{brand.whatsapp}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="mt-1 text-xl font-semibold">{brand.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Office</p>
                <p className="mt-1 text-xl font-semibold">{brand.office}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Market focus</p>
                <p className="mt-1 text-xl font-semibold">{brand.market}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-3">
              <a
                href="https://wa.me/8613800000000"
                className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover"
                target="_blank"
                rel="noreferrer"
              >
                Contact via WhatsApp
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="incar-focus inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
              >
                Email INCAR
              </a>
            </div>
            <div className="mt-8">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
                Business inquiry types
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-metallic-silver">
                {[
                  "RFQ",
                  "Private Label",
                  "Catalog Request",
                  "Sourcing Request",
                  "Quality Control Question",
                  "General Business Inquiry",
                ].map((item) => (
                  <span key={item} className="rounded-sm border border-border px-3 py-2">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">
                Can&apos;t find the part you need? Send the part number, OEM
                number, vehicle model, or product photo through a sourcing
                request.
              </p>
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
