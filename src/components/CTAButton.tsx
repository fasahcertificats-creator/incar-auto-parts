import Link from "next/link";

type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  className?: string;
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const styles = {
    primary:
      "bg-primary text-white shadow-[0_18px_42px_rgba(215,25,32,0.26)] hover:bg-primary-hover",
    secondary:
      "border border-border bg-surface-elevated text-metallic-silver hover:border-metallic-silver/45 hover:bg-surface-muted hover:text-white",
    ghost:
      "border border-border bg-transparent text-metallic-silver hover:border-metallic-silver/40 hover:bg-white/[0.04] hover:text-white",
    dark:
      "bg-background text-white hover:bg-surface",
  };

  return (
    <Link
      href={href}
      className={`incar-focus inline-flex min-h-12 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
