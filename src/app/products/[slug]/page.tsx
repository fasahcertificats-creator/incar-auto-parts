import { notFound } from "next/navigation";

// `/products/:slug` is redirected centrally before filesystem routing. The
// localized product route then enforces publication and sample-data rules.
export default function LegacyProductRouteFallback() {
  notFound();
}
