import { CTAButton } from "@/components/CTAButton";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";

export default async function ProductNotFound() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const copy =
    locale === "ar"
      ? {
          eyebrow: "المنتج غير متاح",
          title: "تعذر العثور على منتج INCAR لهذا الرابط.",
          description:
            "يمكنك استخدام رقم القطعة أو رقم OEM لطلب قطعة غير مدرجة من INCAR.",
          products: "استعراض المنتجات",
        }
      : {
          eyebrow: "Product not found",
          title: "We could not find an INCAR product at this link.",
          description:
            "Use the Part Number or OEM Reference to request an unlisted part from INCAR.",
          products: "View Products",
        };

  return (
    <section className="bg-background px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          {copy.description}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <CTAButton href="/products" variant="secondary">
            {copy.products}
          </CTAButton>
          <CTAButton href="/rfq">{dictionary.common.requestQuotation}</CTAButton>
        </div>
      </div>
    </section>
  );
}
