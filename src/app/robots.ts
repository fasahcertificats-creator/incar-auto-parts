import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ar/rfq", "/en/rfq", "/rfq", "/admin"],
    },
    sitemap: absoluteSiteUrl("/sitemap.xml"),
  };
}
