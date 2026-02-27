import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Palette } from "lucide-react";
import { MUSIC_STYLES } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { useOrderStore } from "@/stores/order";
import { Card } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { GradientText } from "@/components/shared/GradientText";
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};
const staggerGrid = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};
const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};
export default function StylePicker() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language === "he" ? "he" : "en";
    const orderId = useOrderStore((s) => s.orderId);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const loadingMessages = [
        t("style.loading.writing", "Writing lyrics..."),
        t("style.loading.rhyme", "Finding the perfect rhyme..."),
        t("style.loading.personal", "Adding personal touches..."),
        t("style.loading.polish", "Polishing every verse..."),
        t("style.loading.magic", "Sprinkling some magic..."),
        t("style.loading.almost", "Almost there..."),
    ];
    // Rotate loading messages
    useEffect(() => {
        if (!isLoading)
            return;
        const interval = setInterval(() => {
            setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isLoading, loadingMessages.length]);
    const handleSelect = useCallback(async (style) => {
        if (!orderId)
            return;
        setSelectedStyle(style);
        setIsLoading(true);
        try {
            // Patch order with selected style
            await api.patch(`/api/orders/${orderId}`, { selectedStyle: style });
            // Generate lyrics
            await api.post(`/api/orders/${orderId}/generate-lyrics`, {
                style,
            });
            navigate("/create/lyrics");
        }
        catch {
            setIsLoading(false);
            setSelectedStyle(null);
        }
    }, [orderId, navigate]);
    if (isLoading) {
        return (_jsx(LoadingScreen, { messages: loadingMessages, currentIndex: loadingMessageIndex }));
    }
    return (_jsx(Shell, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "min-h-screen px-4 py-12", children: _jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "visible", className: "mb-12 text-center", children: [_jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--glass-bg)] px-4 py-2 backdrop-blur-sm", children: [_jsx(Palette, { className: "h-4 w-4 text-[var(--color-primary)]" }), _jsx("span", { className: "text-sm font-medium text-[var(--text-muted)]", children: t("style.badge", "Step 2 of 4") })] }), _jsx(GradientText, { as: "h1", className: "mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl", children: t("style.title", "Choose a Style") }), _jsx("p", { className: "mx-auto max-w-md text-[var(--text-muted)]", children: t("style.subtitle", "Each style gives your song a unique feel. Pick the one that matches their personality.") })] }), _jsx(motion.div, { variants: staggerGrid, initial: "hidden", animate: "visible", className: "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4", children: MUSIC_STYLES.map((style) => {
                            const isSelected = selectedStyle === style.id;
                            return (_jsx(motion.div, { variants: cardVariants, children: _jsxs(Card, { hoverable: true, onClick: () => handleSelect(style.id), className: cn("relative flex flex-col items-center p-6 text-center transition-all duration-300", "group cursor-pointer", isSelected &&
                                        "ring-2 ring-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/20"), children: [_jsx("div", { className: cn("pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300", "bg-[radial-gradient(circle_at_center,var(--color-primary)/10_0%,transparent_70%)]", "group-hover:opacity-100") }), _jsx(motion.span, { className: "mb-4 block text-5xl sm:text-6xl", whileHover: { scale: 1.2, rotate: [0, -10, 10, 0] }, transition: { duration: 0.4 }, children: style.emoji }), _jsx("h3", { className: "mb-1 text-lg font-bold text-[var(--text)]", children: lang === "he" ? style.nameHe : style.nameEn }), _jsx("p", { className: "text-sm text-[var(--text-muted)]", children: lang === "he"
                                                ? style.descriptionHe
                                                : style.descriptionEn })] }) }, style.id));
                        }) })] }) }) }));
}
