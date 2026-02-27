import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, Copy, Share2, Video, Music, ExternalLink, PartyPopper, } from "lucide-react";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { Confetti } from "@/components/shared/Confetti";
import { GradientText } from "@/components/shared/GradientText";
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};
const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
};
const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3,
        },
    },
};
export default function Success() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const storeOrderId = useOrderStore((s) => s.orderId);
    const orderId = searchParams.get("orderId") ?? storeOrderId;
    const tier = searchParams.get("tier") ?? "song";
    const hasVideo = tier === "bundle" || tier === "premium";
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);
    // Fire confetti on mount
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);
    const shareUrl = `${window.location.origin}/share/${orderId}`;
    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [shareUrl]);
    const handleWhatsApp = useCallback(() => {
        const text = encodeURIComponent(t("success.share.whatsappText", "Check out this personalized birthday song I made! {{url}}", { url: shareUrl }));
        window.open(`https://wa.me/?text=${text}`, "_blank");
    }, [t, shareUrl]);
    const handleTelegram = useCallback(() => {
        const text = encodeURIComponent(t("success.share.telegramText", "Check out this personalized birthday song I made!"));
        const url = encodeURIComponent(shareUrl);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
    }, [t, shareUrl]);
    const downloadUrl = `/api/orders/${orderId}/download`;
    return (_jsxs(Shell, { children: [showConfetti && _jsx(Confetti, {}), _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "flex min-h-screen flex-col items-center justify-center px-4 py-12", children: _jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "mx-auto w-full max-w-lg text-center", children: [_jsx(motion.div, { variants: checkmarkVariants, className: "mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[image:var(--gradient-main)] shadow-2xl shadow-[var(--color-primary)]/30", children: _jsx(CheckCircle, { className: "h-12 w-12 text-white" }) }), _jsx(motion.div, { variants: fadeUp, children: _jsx(GradientText, { as: "h1", className: "mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl", children: t("success.title", "Your Song is Ready!") }) }), _jsx(motion.p, { variants: fadeUp, className: "mb-10 text-lg text-[var(--text-muted)]", children: t("success.subtitle", "Your personalized birthday song has been created. Time to celebrate!") }), _jsx(motion.div, { variants: fadeUp, children: _jsxs(Card, { hoverable: false, className: "mb-6 p-6", children: [_jsxs("h3", { className: "mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[var(--text)]", children: [_jsx(Download, { className: "h-5 w-5 text-[var(--color-primary)]" }), t("success.download.title", "Download Your Song")] }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:justify-center", children: [_jsx(Button, { size: "lg", onClick: () => window.open(`${downloadUrl}?format=mp3`, "_blank"), icon: _jsx(Music, { className: "h-5 w-5" }), className: "flex-1 sm:flex-initial", children: t("success.download.mp3", "Download MP3") }), _jsx(Button, { size: "lg", variant: "secondary", onClick: () => window.open(`${downloadUrl}?format=wav`, "_blank"), icon: _jsx(Music, { className: "h-5 w-5" }), className: "flex-1 sm:flex-initial", children: t("success.download.wav", "Download WAV") })] })] }) }), _jsx(motion.div, { variants: fadeUp, children: _jsxs(Card, { hoverable: false, className: "mb-6 p-6", children: [_jsxs("h3", { className: "mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[var(--text)]", children: [_jsx(Share2, { className: "h-5 w-5 text-[var(--color-primary)]" }), t("success.share.title", "Share the Song")] }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:justify-center", children: [_jsx(Button, { variant: "secondary", onClick: handleCopyLink, icon: copied ? (_jsx(CheckCircle, { className: "h-4 w-4 text-green-400" })) : (_jsx(Copy, { className: "h-4 w-4" })), className: "flex-1 sm:flex-initial", children: copied
                                                    ? t("success.share.copied", "Copied!")
                                                    : t("success.share.copyLink", "Copy Link") }), _jsx(Button, { variant: "secondary", onClick: handleWhatsApp, icon: _jsx(ExternalLink, { className: "h-4 w-4" }), className: "flex-1 sm:flex-initial", children: t("success.share.whatsapp", "WhatsApp") }), _jsx(Button, { variant: "secondary", onClick: handleTelegram, icon: _jsx(ExternalLink, { className: "h-4 w-4" }), className: "flex-1 sm:flex-initial", children: t("success.share.telegram", "Telegram") })] })] }) }), hasVideo && (_jsx(motion.div, { variants: fadeUp, children: _jsxs(Card, { hoverable: true, className: "mb-6 overflow-hidden p-6", children: [_jsx("div", { className: "mb-3 flex justify-center", children: _jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-main)] text-white shadow-lg", children: _jsx(Video, { className: "h-7 w-7" }) }) }), _jsx("h3", { className: "mb-2 text-lg font-bold text-[var(--text)]", children: t("success.video.title", "Now Create a Video!") }), _jsx("p", { className: "mb-4 text-sm text-[var(--text-muted)]", children: t("success.video.description", "Upload photos and we'll create a stunning music video with your song.") }), _jsx(Button, { onClick: () => navigate(`/video/${orderId}`), icon: _jsx(Video, { className: "h-4 w-4" }), iconPosition: "right", children: t("success.video.cta", "Create Video") })] }) })), _jsx(motion.div, { variants: fadeUp, className: "mt-4", children: _jsxs("button", { type: "button", onClick: () => navigate("/create"), className: "inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:underline", children: [_jsx(PartyPopper, { className: "h-4 w-4" }), t("success.createAnother", "Create another song")] }) })] }) })] }));
}
