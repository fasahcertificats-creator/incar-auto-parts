"use client";

import Link from "next/link";
import { footerCapabilityKeys, footerNavigation } from "@/config/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { brand } from "@/lib/brand";

const capabilityLabels = {
  en: {
    "china-sourcing": "China Sourcing",
    "quality-inspection": "Quality Inspection",
    "private-label": "Private Label",
    "export-support": "Export Support",
  },
  ar: {
    "china-sourcing": "التوريد من الصين",
    "quality-inspection": "فحص الجودة",
    "private-label": "العلامة الخاصة",
    "export-support": "دعم التصدير",
  },
};

export function Footer() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  return (
    <footer className="border-t border-border bg-background text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
            {dictionary.brand.name}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            {dictionary.brand.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            {locale === "ar" ? "الخدمات" : "Capabilities"}
          </h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted">
            {footerCapabilityKeys.map((capability) => (
              <li key={capability}>{capabilityLabels[locale][capability]}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            {locale === "ar" ? "روابط الموقع" : "Platform"}
          </h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted">
            {footerNavigation.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="incar-focus rounded-sm hover:text-white"
                >
                  {dictionary.navigation[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{dictionary.brand.leadDesk}</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted">
            <li>{dictionary.brand.office}</li>
            <li>{dictionary.brand.market}</li>
            <li>WhatsApp: {brand.whatsapp}</li>
            <li>Email: {brand.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted">
        {dictionary.brand.footerNote}
      </div>
    </footer>
  );
}
