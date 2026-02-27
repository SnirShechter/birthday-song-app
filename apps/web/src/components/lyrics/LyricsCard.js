"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { LyricsEditor } from "./LyricsEditor";
const MODEL_CONFIG = {
    claude: {
        label: "Claude",
        color: "text-orange-500",
        bg: "bg-orange-500/10 border-orange-500/20",
    },
    gpt4o: {
        label: "GPT-4o",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    gemini: {
        label: "Gemini",
        color: "text-blue-500",
        bg: "bg-blue-500/10 border-blue-500/20",
    },
};
function formatLyrics(text) {
    return text.split("\n").map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) {
            return _jsx("br", {}, i);
        }
        // Detect section headers like [Verse 1], [Chorus], etc.
        if (/^\[.*\]$/.test(trimmed)) {
            return (_jsx("p", { className: "mt-3 mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]", children: trimmed }, i));
        }
        return (_jsx("p", { className: "leading-relaxed", children: trimmed }, i));
    });
}
export function LyricsCard({ variation, isSelected, onSelect, onEdit, }) {
    const [isEditing, setIsEditing] = useState(false);
    const model = MODEL_CONFIG[variation.model] ?? MODEL_CONFIG.claude;
    const displayContent = variation.editedContent || variation.content;
    return (_jsxs(motion.div, { layout: true, whileHover: { y: -2 }, transition: { duration: 0.2 }, className: cn("relative flex flex-col rounded-2xl p-5", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border transition-all duration-300", isSelected
            ? "border-transparent shadow-xl shadow-[var(--color-primary)]/20"
            : "border-[var(--glass-border)] shadow-[var(--glass-shadow)]"), children: [isSelected && (_jsx("div", { className: "pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent bg-clip-border [background:var(--gradient-main)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] p-[2px]" })), _jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsxs("span", { className: cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", model.bg, model.color), children: [_jsx(Sparkles, { className: "h-3 w-3" }), model.label] }), _jsx("span", { className: "rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-muted)] border border-[var(--border)]", children: variation.styleVariant }), isSelected && (_jsx(motion.span, { initial: { scale: 0 }, animate: { scale: 1 }, className: "ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[image:var(--gradient-main)]", children: _jsx(Check, { className: "h-3.5 w-3.5 text-white" }) }))] }), _jsx("div", { className: "mb-4 flex-1", children: _jsx(AnimatePresence, { mode: "wait", children: isEditing ? (_jsx(LyricsEditor, { content: displayContent, onSave: (content) => {
                            onEdit(content);
                            setIsEditing(false);
                        }, onCancel: () => setIsEditing(false) }, "editor")) : (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "max-h-[320px] overflow-y-auto rounded-lg text-sm text-[var(--text)] pr-1", children: formatLyrics(displayContent) }, "display")) }) }), !isEditing && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(motion.button, { whileTap: { scale: 0.95 }, onClick: () => setIsEditing(true), className: cn("flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium", "bg-[var(--surface)] text-[var(--text-muted)]", "border border-[var(--border)]", "hover:text-[var(--text)] hover:border-[var(--color-primary)]/30", "transition-all duration-200 cursor-pointer"), children: [_jsx(Edit3, { className: "h-3.5 w-3.5" }), "Edit"] }), _jsx(motion.button, { whileTap: { scale: 0.95 }, whileHover: { scale: 1.03 }, onClick: onSelect, disabled: isSelected, className: cn("flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold", "transition-all duration-200 cursor-pointer", isSelected
                            ? "bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30 cursor-default"
                            : "bg-[image:var(--gradient-main)] text-white shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:brightness-110"), children: isSelected ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "h-4 w-4" }), "Selected"] })) : ("Choose this") })] }))] }));
}
