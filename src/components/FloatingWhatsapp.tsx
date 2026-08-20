import { brand } from "@/lib/brand";

export function FloatingWhatsapp() {
  if (!brand.whatsappLink) return null;

  return (
    <a
      href={brand.whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="incar-focus fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center justify-center rounded-md border border-primary/34 bg-primary px-4 text-sm font-bold text-white shadow-[0_18px_46px_rgba(215,25,32,0.28)] transition hover:bg-primary-hover"
      aria-label="Contact via WhatsApp"
    >
      WhatsApp
    </a>
  );
}
