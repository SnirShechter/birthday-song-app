import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
const variantStyles = {
    default: [
        "bg-[var(--glass-bg)]",
        "backdrop-blur-[var(--glass-blur)]",
        "border border-[var(--glass-border)]",
    ].join(" "),
    solid: [
        "bg-[var(--surface)]",
        "border border-[var(--border)]",
    ].join(" "),
    outlined: [
        "bg-transparent",
        "border-2 border-[var(--border)]",
    ].join(" "),
};
const Card = forwardRef(({ variant = "default", hoverable = true, className, children, ...props }, ref) => {
    return (_jsx(motion.div, { ref: ref, whileHover: hoverable
            ? {
                scale: 1.02,
                boxShadow: "0 8px 32px rgba(124, 58, 237, 0.15)",
            }
            : undefined, transition: { duration: 0.2, ease: "easeOut" }, className: cn("rounded-2xl p-6", "transition-shadow duration-200", variantStyles[variant], hoverable && "cursor-pointer", className), ...props, children: children }));
});
Card.displayName = "Card";
function CardHeader({ className, children, ...props }) {
    return (_jsx("div", { className: cn("mb-4", className), ...props, children: children }));
}
CardHeader.displayName = "CardHeader";
function CardTitle({ className, children, ...props }) {
    return (_jsx("h3", { className: cn("text-xl font-bold text-[var(--text)]", className), ...props, children: children }));
}
CardTitle.displayName = "CardTitle";
function CardDescription({ className, children, ...props }) {
    return (_jsx("p", { className: cn("text-sm text-[var(--text-muted)]", className), ...props, children: children }));
}
CardDescription.displayName = "CardDescription";
function CardContent({ className, children, ...props }) {
    return (_jsx("div", { className: cn(className), ...props, children: children }));
}
CardContent.displayName = "CardContent";
function CardFooter({ className, children, ...props }) {
    return (_jsx("div", { className: cn("mt-4 flex items-center gap-3", className), ...props, children: children }));
}
CardFooter.displayName = "CardFooter";
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
