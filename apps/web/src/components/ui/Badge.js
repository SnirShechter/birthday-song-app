import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/cn";
const variantStyles = {
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
function Badge({ variant = "default", children, className }) {
    return (_jsx("span", { className: cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5", "text-xs font-semibold leading-5", "select-none whitespace-nowrap", variantStyles[variant], className), children: children }));
}
Badge.displayName = "Badge";
export { Badge };
