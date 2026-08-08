"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routing";
import { useRFQ } from "../use-rfq";

export function RFQList() {
  const { items, removeItem, updateQuantity, clearRFQ } = useRFQ();
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);

  return (
    <section className="incar-card rounded-lg p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
            {dictionary.forms.rfq.listEyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {dictionary.forms.rfq.listTitle}
          </h2>
        </div>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={clearRFQ}
            className="incar-focus rounded-sm text-sm font-semibold text-metallic-silver hover:text-white"
          >
            {dictionary.common.clearRfq}
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4">
        {items.length ? (
          items.map((item) => (
            <article
              key={item.productId}
              className="rounded-md border border-border bg-background p-4"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <Link
                    href={localizeHref(locale, `/products/${item.slug}`)}
                    className="incar-focus rounded-sm text-lg font-semibold text-white hover:text-metallic-silver"
                  >
                    {item.productName}
                  </Link>
                  <dl className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.14em] text-metallic-silver">
                        {dictionary.forms.rfq.brandModel}
                      </dt>
                      <dd className="mt-1 font-semibold text-white">
                        {item.brand} {item.vehicleModel}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.14em] text-metallic-silver">
                        {dictionary.productLabels.partNumber}
                      </dt>
                      <dd dir="ltr" className="mt-1 font-semibold text-white">
                        {item.partNumber}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.14em] text-metallic-silver">
                        {dictionary.productLabels.oemNumber}
                      </dt>
                      <dd dir="ltr" className="mt-1 font-semibold text-white">
                        {item.oemNumber}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="grid gap-3 sm:min-w-36">
                  <label className="grid gap-2 text-sm font-semibold text-metallic-silver">
                    {dictionary.forms.rfq.quantity}
                    <input
                      type="number"
                      min="1"
                      max="999999"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.productId, Number(event.target.value))
                      }
                      className="incar-input min-h-10 px-3 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="incar-focus min-h-10 rounded-md border border-border px-3 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:text-white"
                  >
                    {dictionary.common.remove}
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-dashed border-metallic-silver/24 p-5 text-sm leading-6 text-muted">
            {dictionary.forms.rfq.empty}
            <Link
              href={localizeHref(locale, "/parts")}
              className="incar-focus mt-3 block rounded-sm font-semibold text-metallic-silver hover:text-white"
            >
              {dictionary.common.exploreProducts}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
