"use client";

import { useState } from "react";

export function DiscoverySearchForm({
  action,
  query,
  label,
  placeholder,
  actionLabel,
  loadingLabel,
}: {
  action: string;
  query: string;
  label: string;
  placeholder: string;
  actionLabel: string;
  loadingLabel: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      id="parts-search"
      action={action}
      method="get"
      onSubmit={() => setIsLoading(true)}
      className="incar-card grid gap-3 rounded-lg p-5 md:grid-cols-[1fr_auto] md:items-end"
    >
      <label className="grid gap-2 text-sm font-semibold text-white">
        {label}
        <input
          name="q"
          defaultValue={query}
          dir="ltr"
          autoComplete="off"
          placeholder={placeholder}
          className="incar-input px-4 text-sm font-normal"
        />
      </label>
      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        aria-live="polite"
        className="incar-focus min-h-12 rounded-md bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
      >
        {isLoading ? loadingLabel : actionLabel}
      </button>
    </form>
  );
}
