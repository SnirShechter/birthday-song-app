"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { ChatBubble } from "./ChatBubble";
export function QuestionStep({ question, onAnswer, initialValue, }) {
    const [value, setValue] = useState(initialValue ?? (question.type === "multiselect" ? [] : ""));
    const [submitted, setSubmitted] = useState(!!initialValue);
    const handleSubmit = useCallback(() => {
        if (question.required && !value)
            return;
        if (question.required && Array.isArray(value) && value.length === 0)
            return;
        setSubmitted(true);
        onAnswer(question.id, value);
    }, [value, question, onAnswer]);
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey && question.type !== "textarea") {
            e.preventDefault();
            handleSubmit();
        }
    };
    const handleTextChange = (e) => {
        setValue(e.target.value);
    };
    const handleNumberChange = (e) => {
        const num = e.target.value === "" ? "" : Number(e.target.value);
        setValue(num);
    };
    const handleSelectChange = (e) => {
        setValue(e.target.value);
    };
    const toggleMultiSelect = (option) => {
        const arr = Array.isArray(value) ? value : [];
        const next = arr.includes(option)
            ? arr.filter((v) => v !== option)
            : [...arr, option];
        setValue(next);
    };
    const inputBase = cn("w-full rounded-xl px-4 py-3 text-sm", "bg-[var(--surface)] text-[var(--text)]", "border border-[var(--border)]", "placeholder:text-[var(--text-muted)]", "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]", "transition-colors duration-200");
    const renderInput = () => {
        switch (question.type) {
            case "text":
                return (_jsx("input", { type: "text", className: inputBase, placeholder: question.placeholder, value: value, onChange: handleTextChange, onKeyDown: handleKeyDown, dir: "auto" }));
            case "number":
                return (_jsx("input", { type: "number", className: inputBase, placeholder: question.placeholder, value: value, onChange: handleNumberChange, onKeyDown: handleKeyDown, min: 0, max: 120, dir: "ltr" }));
            case "textarea":
                return (_jsx("textarea", { className: cn(inputBase, "min-h-[80px] resize-y"), placeholder: question.placeholder, value: value, onChange: handleTextChange, rows: 3, dir: "auto" }));
            case "select":
                return (_jsxs("select", { className: cn(inputBase, "cursor-pointer appearance-none"), value: value, onChange: handleSelectChange, dir: "auto", children: [_jsx("option", { value: "", disabled: true, children: question.placeholder || "Select..." }), question.options?.map((opt) => (_jsx("option", { value: opt, children: opt }, opt)))] }));
            case "multiselect":
                return (_jsx("div", { className: "flex flex-wrap gap-2", children: question.options?.map((opt) => {
                        const selected = Array.isArray(value) && value.includes(opt);
                        return (_jsx(motion.button, { type: "button", whileTap: { scale: 0.95 }, onClick: () => toggleMultiSelect(opt), className: cn("rounded-full px-3.5 py-1.5 text-sm font-medium", "border transition-all duration-200 cursor-pointer", selected
                                ? "bg-[image:var(--gradient-main)] text-white border-transparent shadow-md shadow-[var(--color-primary)]/20"
                                : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-[var(--color-primary)]/50"), children: opt }, opt));
                    }) }));
        }
    };
    const displayValue = Array.isArray(value)
        ? value.join(", ")
        : String(value);
    return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(ChatBubble, { type: "ai", animate: true, children: _jsx("p", { className: "font-medium", children: question.label }) }), _jsx(AnimatePresence, { mode: "wait", children: !submitted ? (_jsxs(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.25 }, className: "flex flex-col gap-2 px-2", children: [renderInput(), _jsx("div", { className: "flex justify-end rtl:justify-start", children: _jsx(motion.button, { whileTap: { scale: 0.95 }, whileHover: { scale: 1.03 }, onClick: handleSubmit, disabled: question.required &&
                                    (Array.isArray(value) ? value.length === 0 : !value), className: cn("rounded-xl px-5 py-2 text-sm font-semibold", "bg-[image:var(--gradient-main)] text-white", "shadow-lg shadow-[var(--color-primary)]/25", "hover:shadow-xl hover:brightness-110", "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none", "transition-all duration-200 cursor-pointer"), children: "Continue" }) })] }, "input")) : (_jsx(motion.div, { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, children: _jsx(ChatBubble, { type: "user", animate: false, children: _jsx("p", { children: displayValue }) }) }, "answer")) })] }));
}
