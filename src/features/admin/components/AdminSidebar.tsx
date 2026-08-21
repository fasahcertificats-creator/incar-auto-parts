"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogout } from "@/features/admin/api/client";
import { clearStoredAdminUsername, useStoredAdminUsername } from "../lib/admin-session-storage";
import { AdminNavList } from "./AdminNavList";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const username = useStoredAdminUsername();
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await adminLogout();
    } catch {
      // Session was already invalid — proceed to the login screen regardless.
    } finally {
      clearStoredAdminUsername();
      router.push("/admin/login");
    }
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/admin/requests" className="incar-focus flex items-center gap-2 rounded-md">
          <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-md border border-metallic-silver/35 bg-surface-elevated text-xs font-black text-white">
            INCAR
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-metallic-silver">
            Admin
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <AdminNavList />
      </div>

      <div className="border-t border-border px-3 py-4">
        <p className="truncate px-3 text-xs text-muted">
          Signed in as{" "}
          <span className="font-semibold text-metallic-silver">{username ?? "Admin"}</span>
        </p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="incar-focus mt-2 min-h-10 w-full rounded-md border border-border bg-surface-elevated px-4 text-sm font-semibold text-metallic-silver transition hover:border-metallic-silver/45 hover:bg-surface-muted hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
