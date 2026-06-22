import Link from "next/link";
import { footerCapabilities, footerNavigation } from "@/config/navigation";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
            {brand.name}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            {brand.name} - {brand.positioning}. China sourcing, quality
            inspection, private label packaging, and export support for Saudi
            wholesale buyers.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Capabilities</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted">
            {footerCapabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted">
            {footerNavigation.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="incar-focus rounded-sm hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Lead Desk</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted">
            <li>{brand.office}</li>
            <li>{brand.market}</li>
            <li>WhatsApp: {brand.whatsapp}</li>
            <li>Email: {brand.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted">
        RFQ-only B2B sourcing for China-to-Saudi supply and private label programs.
      </div>
    </footer>
  );
}
