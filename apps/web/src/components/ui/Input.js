import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState, useId, } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";
const Input = forwardRef((props, ref) => {
    const { as = "input", label, error, hint, className, disabled, id: externalId, ...restProps } = props;
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const [focused, setFocused] = useState(false);
    const hasValue = as === "textarea"
        ? Boolean(restProps.value)
        : Boolean(restProps.value);
    const isFloating = focused || hasValue;
    const baseClasses = cn("peer w-full rounded-xl px-4 pt-5 pb-2", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border transition-all duration-200 ease-out", "text-[var(--text)] placeholder-transparent", "outline-none", 
    // Default border
    !error && !focused && "border-[var(--glass-border)]", 
    // Focus border - gradient ring effect
    !error && focused && "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20", 
    // Error border
    error && "border-red-500 ring-2 ring-red-500/20", 
    // Disabled
    disabled && "opacity-50 cursor-not-allowed bg-[var(--surface)]", className);
    const labelClasses = cn("absolute start-4 transition-all duration-200 ease-out pointer-events-none", "origin-[0]", isFloating
        ? "top-1.5 text-xs font-medium"
        : "top-1/2 -translate-y-1/2 text-base", error
        ? "text-red-400"
        : focused
            ? "text-[var(--color-primary)]"
            : "text-[var(--text-muted)]");
    return (_jsxs("div", { className: "relative w-full", children: [_jsxs("div", { className: "relative", children: [as === "textarea" ? (_jsx("textarea", { ref: ref, id: id, disabled: disabled, onFocus: (e) => {
                            setFocused(true);
                            restProps.onFocus?.(e);
                        }, onBlur: (e) => {
                            setFocused(false);
                            restProps.onBlur?.(e);
                        }, rows: props.rows ?? 4, className: cn(baseClasses, "resize-y min-h-[100px]"), placeholder: label ?? " ", ...restProps })) : (_jsx("input", { ref: ref, id: id, disabled: disabled, onFocus: (e) => {
                            setFocused(true);
                            restProps.onFocus?.(e);
                        }, onBlur: (e) => {
                            setFocused(false);
                            restProps.onBlur?.(e);
                        }, className: baseClasses, placeholder: label ?? " ", ...restProps })), label && (_jsx("label", { htmlFor: id, className: labelClasses, children: label }))] }), _jsxs(AnimatePresence, { mode: "wait", children: [error && (_jsx(motion.p, { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, transition: { duration: 0.15 }, className: "mt-1.5 text-sm text-red-400 ps-1", children: error })), !error && hint && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "mt-1.5 text-sm text-[var(--text-muted)] ps-1", children: hint }))] })] }));
});
Input.displayName = "Input";
export { Input };
