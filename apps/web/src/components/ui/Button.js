import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
const variantStyles = {
    primary: [
        "bg-[image:var(--gradient-main)] text-white",
        "shadow-lg shadow-[var(--color-primary)]/25",
        "hover:shadow-xl hover:shadow-[var(--color-primary)]/40",
        "hover:brightness-110",
        "disabled:opacity-50 disabled:shadow-none disabled:hover:brightness-100",
    ].join(" "),
    secondary: [
        "bg-[var(--glass-bg)] text-[var(--text)]",
        "backdrop-blur-[var(--glass-blur)]",
        "border border-[var(--glass-border)]",
        "hover:bg-[var(--surface)] hover:border-[var(--border)]",
        "disabled:opacity-50",
    ].join(" "),
    ghost: [
        "bg-transparent text-[var(--text)]",
        "hover:bg-[var(--glass-bg)]",
        "disabled:opacity-50",
    ].join(" "),
    danger: [
        "bg-red-500/90 text-white",
        "shadow-lg shadow-red-500/25",
        "hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/40",
        "disabled:opacity-50 disabled:shadow-none",
    ].join(" "),
};
const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-base rounded-xl gap-2",
    lg: "px-7 py-3.5 text-lg rounded-2xl gap-2.5",
};
const Button = forwardRef(({ variant = "primary", size = "md", loading = false, icon, iconPosition = "left", disabled, className, children, ...props }, ref) => {
    const isDisabled = disabled || loading;
    return (_jsxs(motion.button, { ref: ref, whileTap: isDisabled ? undefined : { scale: 0.97 }, whileHover: isDisabled ? undefined : { scale: 1.02 }, transition: { type: "spring", stiffness: 400, damping: 17 }, disabled: isDisabled, className: cn("relative inline-flex items-center justify-center font-semibold", "transition-all duration-200 ease-out", "cursor-pointer select-none", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]", "disabled:cursor-not-allowed", variantStyles[variant], sizeStyles[size], className), ...props, children: [loading && (_jsx(Loader2, { className: cn("animate-spin", size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4") })), !loading && icon && iconPosition === "left" && (_jsx("span", { className: "inline-flex shrink-0", children: icon })), children && _jsx("span", { children: children }), !loading && icon && iconPosition === "right" && (_jsx("span", { className: "inline-flex shrink-0", children: icon }))] }));
});
Button.displayName = "Button";
export { Button };
