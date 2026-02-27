import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
const sizeMap = {
    thin: "h-0.5",
    default: "h-2",
    thick: "h-3",
};
function Progress({ value, size = "default", label, showValue = false, className, }) {
    const clampedValue = Math.min(100, Math.max(0, value));
    return (_jsxs("div", { className: cn("w-full", className), children: [(label || showValue) && (_jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [label && (_jsx("span", { className: "text-sm font-medium text-[var(--text)]", children: label })), showValue && (_jsxs("span", { className: "text-sm tabular-nums text-[var(--text-muted)]", children: [Math.round(clampedValue), "%"] }))] })), _jsx("div", { role: "progressbar", "aria-valuenow": clampedValue, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": label, className: cn("w-full overflow-hidden rounded-full", "bg-[var(--surface)] border border-[var(--glass-border)]", sizeMap[size]), children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${clampedValue}%` }, transition: { duration: 0.6, ease: "easeOut" }, className: cn("h-full rounded-full", "bg-[image:var(--gradient-main)]") }) })] }));
}
Progress.displayName = "Progress";
export { Progress };
