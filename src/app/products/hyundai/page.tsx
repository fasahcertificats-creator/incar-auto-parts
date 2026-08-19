import { ProductExplorer } from "@/components/ProductExplorer";
import { SectionHeader } from "@/components/SectionHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { getActiveVehicleModels } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Hyundai Parts Browsing",
  "Browse selected Hyundai applications linked to current INCAR product information.",
);

export default async function HyundaiProductsPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const hyundaiModels = getActiveVehicleModels("Hyundai");

  return (
    <>
      <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            inverse
            eyebrow="Hyundai"
            title={dictionary.pages.products.hyundaiTitle}
            description={dictionary.pages.products.hyundaiDescription}
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {hyundaiModels.map((model) => (
              <span
                key={model.id}
                className="rounded-sm border border-border px-3 py-2 text-sm text-metallic-silver"
              >
                {model.displayName}
              </span>
            ))}
          </div>
        </div>
      </section>
      <ProductExplorer fixedBrand="Hyundai" />
    </>
  );
}
