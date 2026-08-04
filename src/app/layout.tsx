import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { getDirection } from "@/i18n/config";
import { getServerLocale } from "@/i18n/server";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "Wholesale auto parts sourcing from China for auto parts wholesalers and importers across the Middle East.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const direction = getDirection(locale);

  return (
    <html lang={locale} dir={direction} className="h-full antialiased">
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
