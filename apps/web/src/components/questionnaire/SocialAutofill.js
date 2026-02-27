"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Search, CheckCircle2, AlertCircle, User, Sparkles, } from "lucide-react";
import { cn } from "@/lib/cn";
const PLATFORMS = [
    {
        id: "instagram",
        label: "Instagram",
        icon: _jsx(Instagram, { className: "h-5 w-5" }),
        color: "from-purple-500 to-pink-500",
    },
    {
        id: "tiktok",
        label: "TikTok",
        icon: (_jsx("svg", { viewBox: "0 0 24 24", className: "h-5 w-5 fill-current", children: _jsx("path", { d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" }) })),
        color: "from-gray-900 to-gray-700 dark:from-white dark:to-gray-300",
    },
    {
        id: "facebook",
        label: "Facebook",
        icon: _jsx(Facebook, { className: "h-5 w-5" }),
        color: "from-blue-600 to-blue-400",
    },
];
const MOCK_PROFILE = {
    status: "found",
    name: "Alex Johnson",
    estimatedAge: 28,
    personalityTraits: ["Funny", "Adventurous", "Creative"],
    hobbies: ["Photography", "Hiking", "Cooking"],
    humorStyle: "Sarcastic and witty",
    funnyThings: ["Always loses keys", "Terrible at parking"],
    occupationHints: "Works in tech / design",
    favoriteFood: "Sushi",
    travelPlaces: ["Japan", "Iceland"],
    keyPhrases: ["Living my best life", "Coffee first"],
    suggestedSongTone: "funny",
    songMaterial: [
        "Always late but worth the wait",
        "Sushi obsession is real",
        "Camera roll has 10k photos",
    ],
};
export function SocialAutofill({ onAutofill }) {
    const [selectedPlatform, setSelectedPlatform] = useState("instagram");
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("idle");
    const [progress, setProgress] = useState(0);
    const [profile, setProfile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const handleScan = useCallback(() => {
        if (!url.trim())
            return;
        setStatus("loading");
        setProgress(0);
        setProfile(null);
        setErrorMessage("");
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
            setProgress(100);
            if (url.toLowerCase().includes("private")) {
                setStatus("error");
                setErrorMessage("Profile is private. We can't scan private profiles.");
            }
            else {
                setStatus("success");
                setProfile(MOCK_PROFILE);
            }
        }, 2000);
    }, [url]);
    const handleUseData = useCallback(() => {
        if (profile) {
            onAutofill(profile);
        }
    }, [profile, onAutofill]);
    const handleReset = useCallback(() => {
        setStatus("idle");
        setProgress(0);
        setProfile(null);
        setUrl("");
        setErrorMessage("");
    }, []);
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("div", { className: "flex gap-2", children: PLATFORMS.map((p) => (_jsxs(motion.button, { whileTap: { scale: 0.95 }, onClick: () => {
                        setSelectedPlatform(p.id);
                        if (status !== "idle")
                            handleReset();
                    }, className: cn("flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium", "border transition-all duration-200 cursor-pointer", selectedPlatform === p.id
                        ? "bg-[var(--surface-elevated)] border-[var(--color-primary)] text-[var(--text)] shadow-md"
                        : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border)]"), children: [p.icon, _jsx("span", { className: "hidden sm:inline", children: p.label })] }, p.id))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: url, onChange: (e) => setUrl(e.target.value), placeholder: `Enter ${PLATFORMS.find((p) => p.id === selectedPlatform)?.label} URL or username...`, dir: "ltr", className: cn("flex-1 rounded-xl px-4 py-3 text-sm", "bg-[var(--surface)] text-[var(--text)]", "border border-[var(--border)]", "placeholder:text-[var(--text-muted)]", "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]", "transition-colors duration-200"), onKeyDown: (e) => {
                            if (e.key === "Enter")
                                handleScan();
                        }, disabled: status === "loading" }), _jsxs(motion.button, { whileTap: { scale: 0.95 }, whileHover: { scale: 1.03 }, onClick: handleScan, disabled: !url.trim() || status === "loading", className: cn("flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold", "bg-[image:var(--gradient-main)] text-white", "shadow-lg shadow-[var(--color-primary)]/25", "hover:shadow-xl hover:brightness-110", "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none", "transition-all duration-200 cursor-pointer"), children: [_jsx(Search, { className: "h-4 w-4" }), "Scan"] })] }), _jsxs(AnimatePresence, { children: [status === "loading" && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "overflow-hidden", children: _jsxs("div", { className: "glass rounded-xl p-4", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2 text-sm text-[var(--text-muted)]", children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" }, children: _jsx(Search, { className: "h-4 w-4" }) }), "Scanning profile..."] }), _jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-[var(--border)]", children: _jsx(motion.div, { className: "h-full rounded-full bg-[image:var(--gradient-main)]", initial: { width: 0 }, animate: { width: `${progress}%` }, transition: { duration: 0.1 } }) }), _jsxs("p", { className: "mt-1 text-xs text-[var(--text-muted)]", children: [progress, "% complete"] })] }) })), status === "error" && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4", children: [_jsx(AlertCircle, { className: "h-5 w-5 shrink-0 text-red-500" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-red-500", children: errorMessage }), _jsx("p", { className: "mt-0.5 text-xs text-[var(--text-muted)]", children: "Try a different profile or fill in the form manually." })] }), _jsx(motion.button, { whileTap: { scale: 0.95 }, onClick: handleReset, className: "rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer", children: "Try again" })] })), status === "success" && profile && (_jsxs(motion.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 }, transition: { duration: 0.4, ease: "easeOut" }, className: "glass rounded-2xl p-5", children: [_jsxs("div", { className: "mb-4 flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-[image:var(--gradient-main)]", children: _jsx(User, { className: "h-5 w-5 text-white" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-[var(--text)]", children: profile.name }), _jsxs("p", { className: "text-xs text-[var(--text-muted)]", children: [profile.estimatedAge && `~${profile.estimatedAge} years old`, profile.occupationHints &&
                                                        ` | ${profile.occupationHints}`] })] }), _jsx(CheckCircle2, { className: "ml-auto h-5 w-5 text-[var(--color-success)]" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [profile.personalityTraits &&
                                        profile.personalityTraits.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]", children: "Personality" }), _jsx("div", { className: "flex flex-wrap gap-1", children: profile.personalityTraits.map((trait) => (_jsx("span", { className: "rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]", children: trait }, trait))) })] })), profile.hobbies && profile.hobbies.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]", children: "Hobbies" }), _jsx("p", { className: "text-sm text-[var(--text)]", children: profile.hobbies.join(", ") })] })), profile.humorStyle && (_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]", children: "Humor Style" }), _jsx("p", { className: "text-sm text-[var(--text)]", children: profile.humorStyle })] })), profile.funnyThings && profile.funnyThings.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]", children: "Funny Things" }), _jsx("p", { className: "text-sm text-[var(--text)]", children: profile.funnyThings.join("; ") })] })), profile.songMaterial && profile.songMaterial.length > 0 && (_jsxs("div", { className: "sm:col-span-2", children: [_jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]", children: "Song Material" }), _jsx("ul", { className: "list-inside list-disc text-sm text-[var(--text)]", children: profile.songMaterial.map((m, i) => (_jsx("li", { children: m }, i))) })] }))] }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsxs(motion.button, { whileTap: { scale: 0.95 }, whileHover: { scale: 1.03 }, onClick: handleUseData, className: cn("flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold", "bg-[image:var(--gradient-main)] text-white", "shadow-lg shadow-[var(--color-primary)]/25", "hover:shadow-xl hover:brightness-110", "transition-all duration-200 cursor-pointer"), children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Use this data"] }), _jsx(motion.button, { whileTap: { scale: 0.95 }, onClick: handleReset, className: "rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] transition-colors cursor-pointer", children: "Rescan" })] })] }))] })] }));
}
