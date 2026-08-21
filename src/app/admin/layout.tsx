import type { Metadata } from "next";
import { AdminNav } from "@/features/admin/components/AdminNav";

// Internal tool only — never indexed, never linked from the public site.
// robots.ts also disallows /admin, but that only asks well-behaved crawlers
// not to list it; real access control is the session guard on the backend.
export const metadata: Metadata = {
  title: "INCAR Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // English/LTR regardless of whatever locale the public site last used —
    // the root <html> tag is shared with the public site (dir/lang come from
    // getServerLocale() there), so this div forces correct direction for the
    // admin subtree specifically rather than inheriting a stale RTL setting.
    <div dir="ltr" lang="en" className="min-h-screen bg-background text-foreground">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
