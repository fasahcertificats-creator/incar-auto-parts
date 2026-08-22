import type { MetadataRoute } from "next";
import {
  getIndexedMakes,
  getIndexedModelsForMake,
  getIndexedProducts,
} from "@/features/discovery/repository";
import { absoluteSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const publicRoutes = [
  "",
  "/parts",
  "/sourcing-services",
  "/private-label",
  "/catalogs",
  "/about",
  "/contact",
];

function localizedEntry(locale: "ar" | "en", route: string) {
  const arUrl = absoluteSiteUrl(`/ar${route}`);
  const enUrl = absoluteSiteUrl(`/en${route}`);

  return {
    url: locale === "ar" ? arUrl : enUrl,
    alternates: {
      languages: {
        ar: arUrl,
        en: enUrl,
        "x-default": arUrl,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const makes = await getIndexedMakes();
  const products = await getIndexedProducts();
  const modelsByMake = await Promise.all(
    makes.map((make) => getIndexedModelsForMake(make.id)),
  );

  return [
    ...publicRoutes.flatMap((route) => [
      localizedEntry("ar", route),
      localizedEntry("en", route),
    ]),
    ...makes.flatMap((make, index) => [
      localizedEntry("ar", `/parts/${make.slug}`),
      localizedEntry("en", `/parts/${make.slug}`),
      ...modelsByMake[index].flatMap((model) => [
        localizedEntry("ar", `/parts/${make.slug}/${model.slug}`),
        localizedEntry("en", `/parts/${make.slug}/${model.slug}`),
      ]),
    ]),
    ...products.flatMap((product) => [
      localizedEntry("ar", `/products/${product.slug}`),
      localizedEntry("en", `/products/${product.slug}`),
    ]),
  ];
}
