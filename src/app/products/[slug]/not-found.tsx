import { CTAButton } from "@/components/CTAButton";

export default function ProductNotFound() {
  return (
    <section className="bg-background px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-metallic-silver">
          Product not found
        </p>
        <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
          This RFQ product is not available in the current catalog.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Send the part number or OEM number to INCAR and the sourcing team can
          review suitable China factory options.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <CTAButton href="/products" variant="secondary">
            View Products
          </CTAButton>
          <CTAButton href="/rfq">Request Quotation</CTAButton>
        </div>
      </div>
    </section>
  );
}
