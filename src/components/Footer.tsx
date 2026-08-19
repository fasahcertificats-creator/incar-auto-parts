"use client";

import Link from "next/link";
import { footerCapabilityKeys, footerNavigation } from "@/config/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";

const capabilityLabels = {
  en: {
    "china-sourcing": "Manufacturing & Quality",
    "quality-inspection": "Quality Inspection",
    "private-label": "Private Label",
    "export-support": "Order Support",
  },
  ar: {
    "china-sourcing": "التصنيع والجودة",
    "quality-inspection": "فحص الجودة",
    "private-label": "العلامة الخاصة",
    "export-support": "دعم الطلبات",
  },
};

export function Footer() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  return (
    <footer className="border-t border-border bg-background text-white">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 sm:py-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-metallic-silver sm:tracking-[0.16em]">
            {dictionary.brand.name}
          </p>
          <p className="mt-2 max-w-md text-[14px] leading-6 text-muted sm:mt-4 sm:text-sm sm:leading-7">
            {dictionary.brand.description}
          </p>
        </div>

        <div className="border-t border-metallic-silver/10 pt-4 md:border-t-0 md:pt-0">
          <h3 className="text-[13.5px] font-semibold md:text-sm">
            {locale === "ar" ? "الخدمات" : "Capabilities"}
          </h3>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[14px] leading-6 text-muted md:mt-4 md:grid-cols-1 md:gap-3 md:text-sm">
            {footerCapabilityKeys.map((capability) => (
              <li key={capability}>{capabilityLabels[locale][capability]}</li>
            ))}
          </ul>
        </div>

        <div className="border-t border-metallic-silver/10 pt-4 md:border-t-0 md:pt-0">
          <h3 className="text-[13.5px] font-semibold md:text-sm">
            {locale === "ar" ? "روابط الموقع" : "Site links"}
          </h3>
          <ul className="mt-1 grid grid-cols-2 gap-x-4 text-[14px] text-muted md:mt-4 md:grid-cols-1 md:gap-3 md:text-sm">
            <li>
              <Link
                href={localizeHref(locale, "/rfq/upload-list")}
                className="incar-focus flex min-h-11 items-center rounded-sm transition hover:text-white md:min-h-0"
              >
                {dictionary.navigation.uploadPartsList}
              </Link>
            </li>
            {footerNavigation.map((item) => (
              <li key={item.key}>
                <Link
                  href={localizeHref(locale, item.href)}
                  className="incar-focus flex min-h-11 items-center rounded-sm transition hover:text-white md:min-h-0"
                >
                  {dictionary.navigation[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="border-t border-border px-4 py-3 text-center text-xs leading-5 text-muted sm:py-5">
        {dictionary.brand.footerNote}
      </div>
    </footer>
  );
}
