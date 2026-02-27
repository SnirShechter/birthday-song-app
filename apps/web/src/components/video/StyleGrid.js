"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { VIDEO_STYLES } from "@birthday-song/shared";
import { useUIStore } from "@/stores/uiStore";
export function StyleGrid({ selectedId, onSelect }) {
    const language = useUIStore((s) => s.language);
    return (_jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5", children: VIDEO_STYLES.map((style) => {
            const isSelected = selectedId === style.id;
            return (_jsxs(motion.button, { whileTap: { scale: 0.95 }, whileHover: { scale: 1.03, y: -2 }, onClick: () => onSelect(style.id), className: cn("relative flex flex-col items-center gap-2 rounded-2xl p-4", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border transition-all duration-300 cursor-pointer", isSelected
                    ? "border-transparent shadow-xl shadow-[var(--color-primary)]/20"
                    : "border-[var(--glass-border)] shadow-[var(--glass-shadow)] hover:border-[var(--color-primary)]/30"), children: [isSelected && (_jsx(motion.div, { layoutId: "style-grid-selected-border", className: "pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent bg-clip-border [background:var(--gradient-main)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] p-[2px]", transition: { type: "spring", stiffness: 300, damping: 28 } })), _jsx(motion.span, { className: "text-3xl", animate: isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }, transition: { duration: 0.4 }, children: style.emoji }), _jsx("span", { className: cn("text-sm font-semibold text-center", isSelected
                            ? "text-[var(--text)]"
                            : "text-[var(--text-secondary)]"), children: language === "he" ? style.nameHe : style.nameEn }), isSelected && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[image:var(--gradient-main)] shadow-md", children: _jsx("svg", { className: "h-3 w-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 3, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }))] }, style.id));
        }) }));
}
