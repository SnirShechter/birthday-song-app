"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
export function ProgressBar({ currentStep, totalSteps }) {
    const progress = totalSteps > 0 ? Math.min(currentStep / totalSteps, 1) : 0;
    return (_jsx("div", { className: "fixed left-0 right-0 top-0 z-50 h-[3px] bg-[var(--border-light)]", children: _jsx(motion.div, { className: "h-full bg-[image:var(--gradient-main)]", initial: { width: 0 }, animate: { width: `${progress * 100}%` }, transition: { duration: 0.5, ease: "easeOut" } }) }));
}
