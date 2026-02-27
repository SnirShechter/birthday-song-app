import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Headphones, Lock, Check, Volume2, } from "lucide-react";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { Waveform } from "@/components/player/Waveform";
import { GradientText } from "@/components/shared/GradientText";
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};
const staggerList = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};
const variationLabels = [
    { label: "Energetic", icon: "lightning" },
    { label: "Smooth", icon: "waves" },
    { label: "Classic", icon: "sparkle" },
];
export default function SongPreview() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const orderId = useOrderStore((s) => s.orderId);
    const [songs, setSongs] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [fetching, setFetching] = useState(true);
    // Fetch songs on mount
    useEffect(() => {
        if (!orderId)
            return;
        let cancelled = false;
        const fetchSongs = async () => {
            try {
                const data = await api.get(`/api/orders/${orderId}/songs`);
                if (!cancelled) {
                    setSongs(data);
                    setFetching(false);
                }
            }
            catch {
                if (!cancelled)
                    setFetching(false);
            }
        };
        fetchSongs();
        return () => {
            cancelled = true;
        };
    }, [orderId]);
    const handleSelect = useCallback(async (songId) => {
        if (!orderId)
            return;
        setSelectedId(songId);
        try {
            await api.patch(`/api/orders/${orderId}`, {
                selectedSongId: songId,
            });
        }
        catch {
            // Selection persists locally even if patch fails
        }
    }, [orderId]);
    const handleCheckout = useCallback(() => {
        if (!orderId || selectedId === null)
            return;
        navigate(`/checkout/${orderId}`);
    }, [orderId, selectedId, navigate]);
    if (fetching) {
        return (_jsx(Shell, { children: _jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-center", children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: "linear" }, className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[image:var(--gradient-main)]", children: _jsx(Headphones, { className: "h-6 w-6 text-white" }) }), _jsx("p", { className: "text-[var(--text-muted)]", children: t("preview.fetching", "Loading your songs...") })] }) }) }));
    }
    return (_jsx(Shell, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "min-h-screen px-4 py-12", children: _jsxs("div", { className: "mx-auto max-w-2xl", children: [_jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "visible", className: "mb-10 text-center", children: [_jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--glass-bg)] px-4 py-2 backdrop-blur-sm", children: [_jsx(Headphones, { className: "h-4 w-4 text-[var(--color-primary)]" }), _jsx("span", { className: "text-sm font-medium text-[var(--text-muted)]", children: t("preview.badge", "Step 4 of 4") })] }), _jsx(GradientText, { as: "h1", className: "mb-3 text-3xl font-extrabold sm:text-4xl", children: t("preview.title", "Listen to Your Song") }), _jsx("p", { className: "mx-auto max-w-md text-[var(--text-muted)]", children: t("preview.subtitle", "We composed multiple variations. Listen and choose your favorite.") })] }), _jsx(motion.div, { variants: staggerList, initial: "hidden", animate: "visible", className: "space-y-4", children: songs.map((song, index) => {
                            const isSelected = selectedId === song.id;
                            const labelInfo = variationLabels[index] ?? {
                                label: `Variation ${index + 1}`,
                            };
                            return (_jsx(motion.div, { variants: fadeUp, children: _jsxs(Card, { hoverable: true, onClick: () => handleSelect(song.id), className: cn("relative overflow-hidden p-5 transition-all duration-300", isSelected && [
                                        "ring-2 ring-transparent",
                                        "shadow-xl shadow-[var(--color-primary)]/20",
                                    ]), style: isSelected
                                        ? {
                                            background: "linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box, var(--gradient-main) border-box",
                                            borderColor: "transparent",
                                        }
                                        : undefined, children: [isSelected && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[image:var(--gradient-main)] text-white shadow-lg", children: _jsx(Check, { className: "h-4 w-4" }) })), _jsxs("div", { className: "mb-4 flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)]", children: _jsx(Volume2, { className: cn("h-5 w-5", isSelected
                                                            ? "text-[var(--color-primary)]"
                                                            : "text-[var(--text-muted)]") }) }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-[var(--text)]", children: [t(`preview.variation.${index + 1}`, `Variation ${index + 1}`), " ", _jsxs("span", { className: "font-normal text-[var(--text-muted)]", children: ["\u2014", " ", t(`preview.variationLabel.${index}`, labelInfo.label)] })] }), song.durationSeconds && (_jsxs("span", { className: "text-xs text-[var(--text-muted)]", children: [Math.floor(song.durationSeconds / 60), ":", String(Math.round(song.durationSeconds % 60)).padStart(2, "0")] }))] })] }), _jsxs("div", { className: "space-y-3", children: [song.previewUrl && (_jsx(MiniPlayer, { src: song.previewUrl, title: t(`preview.variation.${index + 1}`, `Variation ${index + 1}`) })), song.previewUrl && (_jsx(Waveform, { src: song.previewUrl, height: 40 }))] }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx(Button, { size: "sm", variant: isSelected ? "primary" : "secondary", onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleSelect(song.id);
                                                }, icon: isSelected ? (_jsx(Check, { className: "h-4 w-4" })) : undefined, children: isSelected
                                                    ? t("preview.selected", "Selected")
                                                    : t("preview.select", "Select") }) })] }) }, song.id));
                        }) }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5 }, className: "mt-6 flex items-center justify-center gap-2", children: [_jsx(Lock, { className: "h-3.5 w-3.5 text-[var(--text-muted)]" }), _jsx("p", { className: "text-sm text-[var(--text-muted)]", children: t("preview.previewNote", "You're hearing a 10-second preview") })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, className: "mt-10 text-center", children: _jsx(Button, { size: "lg", onClick: handleCheckout, disabled: selectedId === null, icon: _jsx(Lock, { className: "h-5 w-5" }), className: "px-10 py-5 text-lg font-bold", children: t("preview.unlock", "Unlock Full Song — $9.99") }) })] }) }) }));
}
