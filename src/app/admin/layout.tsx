import type { Metadata } from "next";
import { AdminMobileNav } from "@/features/admin/components/AdminMobileNav";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

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
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* AdminSidebar/AdminMobileNav render nothing on /admin/login, so the
            login page just gets the bare <main> below, centered by its own
            markup — same as before this restructure. */}
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminMobileNav />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
