import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/products";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getActiveProducts();

  return [
    ...publicRoutes.flatMap((route) => [
      localizedEntry("ar", route),
      localizedEntry("en", route),
    ]),
    ...products.flatMap((product) => [
      localizedEntry("ar", `/products/${product.slug}`),
      localizedEntry("en", `/products/${product.slug}`),
    ]),
  ];
}
