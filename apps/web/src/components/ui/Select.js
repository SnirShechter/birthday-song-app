import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState, useRef, useEffect, useCallback, useId, } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/cn";
const dropdownVariants = {
    hidden: { opacity: 0, y: -4, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.98 },
};
const Select = forwardRef(({ options, value, onChange, label, placeholder = "Select...", error, disabled = false, className, }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const selectId = useId();
    const selectedOption = options.find((o) => o.value === value);
    // Close on outside click
    useEffect(() => {
        if (!open)
            return;
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);
    // Close on Escape
    useEffect(() => {
        if (!open)
            return;
        const handler = (e) => {
            if (e.key === "Escape")
                setOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open]);
    const handleSelect = useCallback((optionValue) => {
        onChange?.(optionValue);
        setOpen(false);
    }, [onChange]);
    return (_jsxs("div", { ref: containerRef, className: cn("relative w-full", className), children: [_jsxs("button", { ref: ref, id: selectId, type: "button", disabled: disabled, onClick: () => setOpen((prev) => !prev), "aria-haspopup": "listbox", "aria-expanded": open, className: cn("flex w-full items-center justify-between rounded-xl px-4 py-3", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border transition-all duration-200 ease-out", "text-start", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50", !error && !open && "border-[var(--glass-border)]", !error && open && "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20", error && "border-red-500 ring-2 ring-red-500/20", disabled && "opacity-50 cursor-not-allowed"), children: [_jsxs("div", { className: "flex flex-col min-w-0", children: [label && (_jsx("span", { className: cn("text-xs font-medium transition-colors", error
                                    ? "text-red-400"
                                    : open
                                        ? "text-[var(--color-primary)]"
                                        : "text-[var(--text-muted)]"), children: label })), _jsx("span", { className: cn("truncate text-sm", selectedOption ? "text-[var(--text)]" : "text-[var(--text-muted)]"), children: selectedOption?.label ?? placeholder })] }), _jsx(motion.span, { animate: { rotate: open ? 180 : 0 }, transition: { duration: 0.2 }, className: "ms-2 shrink-0 text-[var(--text-muted)]", children: _jsx(ChevronDown, { className: "h-4 w-4" }) })] }), _jsx(AnimatePresence, { children: open && (_jsx(motion.ul, { variants: dropdownVariants, initial: "hidden", animate: "visible", exit: "exit", transition: { duration: 0.15, ease: "easeOut" }, role: "listbox", "aria-labelledby": selectId, className: cn("absolute z-50 mt-2 w-full rounded-xl py-1 overflow-auto", "max-h-60", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border border-[var(--glass-border)]", "shadow-xl shadow-black/15"), children: options.map((option) => {
                        const isSelected = option.value === value;
                        return (_jsxs("li", { role: "option", "aria-selected": isSelected, "aria-disabled": option.disabled, onClick: () => {
                                if (!option.disabled)
                                    handleSelect(option.value);
                            }, className: cn("flex items-center gap-3 px-4 py-2.5 cursor-pointer", "transition-colors duration-100", isSelected
                                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                : "text-[var(--text)] hover:bg-[var(--surface)]", option.disabled && "opacity-40 cursor-not-allowed"), children: [_jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [_jsx("span", { className: "text-sm font-medium truncate", children: option.label }), option.description && (_jsx("span", { className: "text-xs text-[var(--text-muted)] truncate", children: option.description }))] }), isSelected && (_jsx(Check, { className: "h-4 w-4 shrink-0 text-[var(--color-primary)]" }))] }, option.value));
                    }) })) }), _jsx(AnimatePresence, { children: error && (_jsx(motion.p, { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, className: "mt-1.5 text-sm text-red-400 ps-1", children: error })) })] }));
});
Select.displayName = "Select";
export { Select };
