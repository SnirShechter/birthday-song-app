import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};
const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
};
function Dialog({ open, onClose, title, description, children, footer, maxWidth = "max-w-lg", hideCloseButton = false, className, }) {
    const panelRef = useRef(null);
    // Close on Escape key
    useEffect(() => {
        if (!open)
            return;
        const handler = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);
    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [open]);
    const handleBackdropClick = useCallback((e) => {
        // Only close if click is directly on the backdrop (not the panel)
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);
    return (_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { variants: backdropVariants, initial: "hidden", animate: "visible", exit: "hidden", transition: { duration: 0.2 }, onClick: handleBackdropClick, className: cn("fixed inset-0 z-50 flex items-center justify-center p-4", "bg-black/50 backdrop-blur-sm"), "aria-modal": "true", role: "dialog", children: _jsxs(motion.div, { ref: panelRef, variants: panelVariants, initial: "hidden", animate: "visible", exit: "exit", transition: { type: "spring", stiffness: 350, damping: 30 }, className: cn("relative w-full rounded-2xl p-6", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border border-[var(--glass-border)]", "shadow-2xl shadow-black/20", maxWidth, className), children: [!hideCloseButton && (_jsx("button", { type: "button", onClick: onClose, className: cn("absolute top-4 end-4 p-1.5 rounded-lg", "text-[var(--text-muted)] hover:text-[var(--text)]", "hover:bg-[var(--surface)] transition-colors duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50"), "aria-label": "Close dialog", children: _jsx(X, { className: "h-5 w-5" }) })), title && (_jsx("h2", { className: "text-xl font-bold text-[var(--text)] pe-8", children: title })), description && (_jsx("p", { className: "mt-1 text-sm text-[var(--text-muted)]", children: description })), children && (_jsx("div", { className: cn("mt-4", title || description ? "" : ""), children: children })), footer && (_jsx("div", { className: "mt-6 flex items-center justify-end gap-3", children: footer }))] }, "dialog-panel") }, "dialog-backdrop")) }));
}
Dialog.displayName = "Dialog";
export { Dialog };
