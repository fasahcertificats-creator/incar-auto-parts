import { notFound } from "next/navigation";

// The permanent redirect for `/` is centralized in next.config.ts and runs
// before filesystem routing. This fallback prevents root content from being
// rendered if that redirect configuration is ever bypassed.
export default function RootRouteFallback() {
  notFound();
}
