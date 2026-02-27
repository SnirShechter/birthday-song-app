"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { cn } from "@/lib/cn";
const MAX_CHARS = 5000;
export function LyricsEditor({ content, onSave, onCancel }) {
    const [text, setText] = useState(content);
    const textareaRef = useRef(null);
    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (!el)
            return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, []);
    useEffect(() => {
        autoResize();
    }, [text, autoResize]);
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);
    const remaining = MAX_CHARS - text.length;
    const isOverLimit = remaining < 0;
    return (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.25 }, className: "flex flex-col gap-3", children: [_jsx("div", { className: cn("rounded-xl p-1", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border border-[var(--glass-border)]"), children: _jsx("textarea", { ref: textareaRef, value: text, onChange: (e) => setText(e.target.value), dir: "auto", className: cn("w-full resize-none rounded-lg bg-transparent px-4 py-3", "text-sm leading-relaxed text-[var(--text)]", "placeholder:text-[var(--text-muted)]", "focus:outline-none", "font-mono"), rows: 8, maxLength: MAX_CHARS + 100 }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: cn("text-xs", isOverLimit ? "text-red-500 font-semibold" : "text-[var(--text-muted)]"), children: [text.length, "/", MAX_CHARS] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(motion.button, { whileTap: { scale: 0.95 }, onClick: onCancel, className: cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium", "text-[var(--text-muted)] hover:text-[var(--text)]", "hover:bg-[var(--glass-bg)]", "transition-colors duration-200 cursor-pointer"), children: [_jsx(X, { className: "h-3.5 w-3.5" }), "Cancel"] }), _jsxs(motion.button, { whileTap: { scale: 0.95 }, whileHover: { scale: 1.03 }, onClick: () => onSave(text), disabled: isOverLimit || text.trim().length === 0, className: cn("flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold", "bg-[image:var(--gradient-main)] text-white", "shadow-md shadow-[var(--color-primary)]/20", "hover:shadow-lg hover:brightness-110", "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none", "transition-all duration-200 cursor-pointer"), children: [_jsx(Save, { className: "h-3.5 w-3.5" }), "Save"] })] })] })] }));
}
