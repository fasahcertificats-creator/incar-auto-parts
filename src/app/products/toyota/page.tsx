import { ProductExplorer } from "@/components/ProductExplorer";
import { SectionHeader } from "@/components/SectionHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/server";
import { getActiveVehicleModels } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Toyota Products",
  "Toyota auto parts sourcing from China for Saudi wholesale buyers, covering Camry, Corolla, Hilux, Yaris, Land Cruiser, and Fortuner.",
);

export default async function ToyotaProductsPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const toyotaModels = getActiveVehicleModels("Toyota");

  return (
    <>
      <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            inverse
            eyebrow="Toyota"
            title={dictionary.pages.products.toyotaTitle}
            description={dictionary.pages.products.toyotaDescription}
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {toyotaModels.map((model) => (
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
      <ProductExplorer fixedBrand="Toyota" />
    </>
  );
}
