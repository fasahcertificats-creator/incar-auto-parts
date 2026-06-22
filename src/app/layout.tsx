import type { Metadata } from "next";
import { FloatingWhatsapp } from "@/components/FloatingWhatsapp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { brand } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.metadataBase),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "China-based automotive sourcing, quality inspection, private label packaging, and export support for Saudi wholesale auto parts buyers.",
  alternates: {
    languages: {
      en: "/",
      ar: "/?lang=ar",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsapp />
        </Providers>
      </body>
    </html>
  );
}
