"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminApiError, adminLogin } from "@/features/admin/api/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const data = new FormData(event.currentTarget);
    const username = String(data.get("username") ?? "").trim();
    const password = String(data.get("password") ?? "");

    setSubmitting(true);
    setError(null);
    try {
      await adminLogin(username, password);
      router.push("/admin/requests");
    } catch (caught) {
      setError(
        caught instanceof AdminApiError
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-white">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted">Internal access only.</p>

      <form onSubmit={handleSubmit} className="incar-card mt-6 grid gap-4 rounded-lg p-6" noValidate>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Username
          <input name="username" autoComplete="username" required className="incar-input px-4 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="incar-input px-4 text-sm"
          />
        </label>

        {error ? (
          <p role="alert" className="rounded-md border border-primary/35 bg-primary/10 p-3 text-sm text-soft-silver">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="incar-focus mt-2 min-h-12 rounded-md bg-primary text-sm font-semibold text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
