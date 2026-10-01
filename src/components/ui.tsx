import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, color }: { title: string; subtitle?: ReactNode; color?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold" style={color ? { color } : undefined}>
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </header>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" };

export function Button({ variant = "primary", className = "", ...rest }: BtnProps) {
  const styles = {
    primary: "bg-accent text-white hover:opacity-90",
    outline: "border border-border bg-card hover:bg-bg",
    ghost: "hover:bg-bg",
  }[variant];
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed ${styles} ${className}`}
      {...rest}
    />
  );
}

export function Pill({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-block rounded-full border px-2 py-0.5 text-xs"
      style={{ color: color || "var(--muted)", borderColor: color || "var(--border)" }}
    >
      {children}
    </span>
  );
}
