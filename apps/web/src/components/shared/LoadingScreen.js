import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";
const defaultMessagesEn = [
    "Tuning the instruments...",
    "Writing the perfect melody...",
    "Adding a sprinkle of magic...",
    "Warming up the vocals...",
    "Mixing beats and wishes...",
    "Composing your birthday anthem...",
    "Polishing the high notes...",
    "Almost ready to celebrate!",
];
const defaultMessagesHe = [
    "...מכוונים את הכלים",
    "...כותבים את המנגינה המושלמת",
    "...מוסיפים קצת קסם",
    "...מחממים את הקול",
    "...מערבבים ביטים ואיחולים",
    "...מלחינים את המנון יום ההולדת שלך",
    "!כמעט מוכנים לחגוג",
];
function LoadingScreen({ messages, className }) {
    const [messageIndex, setMessageIndex] = useState(0);
    const allMessages = messages ?? defaultMessagesEn;
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % allMessages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [allMessages.length]);
    return (_jsxs("div", { className: cn("fixed inset-0 z-[60] flex flex-col items-center justify-center", "bg-[var(--bg)]", className), children: [_jsx("div", { "aria-hidden": "true", className: "absolute inset-0 opacity-40", style: {
                    background: "radial-gradient(ellipse at 30% 50%, var(--color-primary), transparent 60%), radial-gradient(ellipse at 70% 50%, var(--color-accent), transparent 60%)",
                } }), _jsx("div", { className: "relative z-10 mb-8", children: _jsxs("svg", { className: "h-20 w-20 animate-spin", viewBox: "0 0 80 80", fill: "none", style: { animationDuration: "1.5s" }, children: [_jsx("circle", { cx: "40", cy: "40", r: "34", stroke: "var(--glass-border)", strokeWidth: "4" }), _jsx("circle", { cx: "40", cy: "40", r: "34", stroke: "url(#spinner-gradient)", strokeWidth: "4", strokeLinecap: "round", strokeDasharray: "160", strokeDashoffset: "100" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "spinner-gradient", x1: "0", y1: "0", x2: "80", y2: "80", children: [_jsx("stop", { offset: "0%", stopColor: "var(--color-primary)" }), _jsx("stop", { offset: "100%", stopColor: "var(--color-accent)" })] }) })] }) }), _jsx("div", { className: "relative z-10 h-8 flex items-center justify-center", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.p, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.3 }, className: "text-base font-medium text-[var(--text)]", children: allMessages[messageIndex] }, messageIndex) }) }), _jsx("div", { className: "relative z-10 mt-6 flex items-center gap-2", children: [0, 1, 2].map((i) => (_jsx(motion.div, { animate: {
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 1, 0.4],
                    }, transition: {
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                    }, className: "h-2 w-2 rounded-full bg-[image:var(--gradient-main)]" }, i))) })] }));
}
LoadingScreen.displayName = "LoadingScreen";
export { LoadingScreen, defaultMessagesEn, defaultMessagesHe };
