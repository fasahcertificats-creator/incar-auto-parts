"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogout } from "@/features/admin/api/client";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await adminLogout();
    } catch {
      // Session was already invalid — proceed to the login screen regardless.
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <header className="border-b border-border bg-surface px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/admin/requests" className="text-sm font-bold tracking-[0.08em] text-white">
          INCAR ADMIN
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="incar-focus min-h-10 rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:bg-surface-muted hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}
