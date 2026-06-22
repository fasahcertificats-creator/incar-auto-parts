import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { getActiveProducts } from "@/lib/products";

export const dynamic = "force-static";

const staticRoutes = [
  "",
  "/products",
  "/private-label",
  "/quality-control",
  "/catalogs",
  "/rfq",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = brand.metadataBase;
  const now = new Date();
  const products = getActiveProducts();

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: now,
    })),
  ];
}
