import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BadgeVariant = "default" | "outline" | "muted";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: [
    "bg-[image:var(--gradient-main)] text-white",
    "shadow-sm shadow-[var(--color-primary)]/20",
  ].join(" "),
  outline: [
    "bg-transparent",
    "border border-[var(--color-primary)]",
    "text-[var(--color-primary)]",
  ].join(" "),
  muted: [
    "bg-[var(--surface)]",
    "border border-[var(--border)]",
    "text-[var(--text-muted)]",
  ].join(" "),
};

function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
        "text-xs font-semibold leading-5",
        "select-none whitespace-nowrap",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

Badge.displayName = "Badge";

export { Badge };
