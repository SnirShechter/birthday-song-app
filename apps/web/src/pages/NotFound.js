import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Home, Music } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Shell } from "@/components/layout/Shell";
import { GradientText } from "@/components/shared/GradientText";
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};
const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};
const noteVariants = {
    animate: (i) => ({
        y: [0, -30, 0],
        x: [0, i % 2 === 0 ? 10 : -10, 0],
        rotate: [0, i % 2 === 0 ? 20 : -20, 0],
        opacity: [0.15, 0.5, 0.15],
        transition: {
            duration: 3 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
        },
    }),
};
const notes = [
    { char: "♪", left: "10%", top: "20%", size: 32 },
    { char: "♫", left: "85%", top: "15%", size: 40 },
    { char: "♩", left: "20%", top: "70%", size: 28 },
    { char: "♬", left: "75%", top: "65%", size: 36 },
    { char: "♪", left: "50%", top: "10%", size: 24 },
    { char: "♫", left: "30%", top: "85%", size: 30 },
    { char: "♩", left: "65%", top: "80%", size: 26 },
    { char: "♬", left: "90%", top: "45%", size: 34 },
];
export default function NotFound() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (_jsx(Shell, { children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.4 }, className: "relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4", children: [_jsx("div", { className: "pointer-events-none absolute inset-0 -z-10", children: notes.map((note, i) => (_jsx(motion.span, { custom: i, variants: noteVariants, animate: "animate", className: "absolute text-[var(--color-primary)]", style: {
                            left: note.left,
                            top: note.top,
                            fontSize: `${note.size}px`,
                        }, children: note.char }, i))) }), _jsxs("div", { className: "pointer-events-none absolute inset-0 -z-20", children: [_jsx(motion.div, { className: "absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full opacity-15", style: {
                                background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
                            }, animate: { scale: [1, 1.15, 1] }, transition: {
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            } }), _jsx(motion.div, { className: "absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full opacity-10", style: {
                                background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)",
                            }, animate: { scale: [1, 1.2, 1] }, transition: {
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            } })] }), _jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "text-center", children: [_jsx(motion.div, { variants: fadeUp, children: _jsx(GradientText, { as: "h1", className: "text-[8rem] font-black leading-none sm:text-[10rem] md:text-[12rem]", children: "404" }) }), _jsx(motion.div, { variants: fadeUp, className: "mb-6 flex justify-center", children: _jsx(motion.div, { animate: { rotate: [0, -10, 10, 0] }, transition: {
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }, className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--glass-bg)] backdrop-blur-sm", children: _jsx(Music, { className: "h-8 w-8 text-[var(--color-primary)]" }) }) }), _jsx(motion.h2, { variants: fadeUp, className: "mb-3 text-2xl font-bold text-[var(--text)] sm:text-3xl", children: t("notFound.title", "Page Not Found") }), _jsx(motion.p, { variants: fadeUp, className: "mb-8 text-lg text-[var(--text-muted)]", children: t("notFound.message", "This song hasn't been written yet.") }), _jsx(motion.div, { variants: fadeUp, children: _jsx(Button, { size: "lg", onClick: () => navigate("/"), icon: _jsx(Home, { className: "h-5 w-5" }), className: "px-8", children: t("notFound.goHome", "Go Home") }) })] })] }) }));
}
