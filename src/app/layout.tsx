import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { getDirection } from "@/i18n/config";
import { getServerLocale } from "@/i18n/server";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

// Cairo is a genuine dual-script family (Kufi-influenced Arabic designed
// alongside its Latin) rather than a Latin font paired with an unrelated
// Arabic one — Inter, which globals.css referenced before this, has near-zero
// Arabic glyph coverage and isn't usable for the site's primary language.
const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "Explore INCAR auto parts products, request wholesale quotations, and review manufacturing, quality, packaging, and Private Label capabilities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const direction = getDirection(locale);

  return (
    <html lang={locale} dir={direction} className={`h-full antialiased ${cairo.variable}`}>
      <body className="min-h-full bg-background text-foreground">
        <Providers initialLocale={locale}>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
