import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Video, Download, ArrowLeft, CheckCircle, Image, Sparkles, } from "lucide-react";
import { VIDEO_STYLES } from "@birthday-song/shared";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { PhotoUploader } from "@/components/video/PhotoUploader";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { StyleGrid } from "@/components/video/StyleGrid";
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
const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
};
export default function VideoUpload() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [videoState, setVideoState] = useState("upload");
    const [videoData, setVideoData] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const pollIntervalRef = useRef(null);
    const loadingMessages = [
        t("video.loading.processing", "Processing your photos..."),
        t("video.loading.transitions", "Creating transitions..."),
        t("video.loading.syncing", "Syncing with the music..."),
        t("video.loading.effects", "Adding visual effects..."),
        t("video.loading.rendering", "Rendering your video..."),
        t("video.loading.almost", "Almost ready to watch..."),
    ];
    // Rotate loading messages
    useEffect(() => {
        if (videoState !== "generating")
            return;
        const interval = setInterval(() => {
            setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [videoState, loadingMessages.length]);
    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, []);
    const handlePhotosChange = useCallback((files) => {
        setPhotos(files);
    }, []);
    const handleStyleSelect = useCallback((styleId) => {
        setSelectedStyle(styleId);
    }, []);
    const pollVideoStatus = useCallback(async () => {
        if (!orderId)
            return;
        try {
            const status = await api.get(`/api/orders/${orderId}/video/status`);
            if (status.status === "completed") {
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                setVideoData(status);
                setVideoState("complete");
                setGenerating(false);
            }
            else if (status.status === "failed") {
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                setVideoState("upload");
                setGenerating(false);
            }
        }
        catch {
            // Keep polling on transient errors
        }
    }, [orderId]);
    const handleGenerate = useCallback(async () => {
        if (!orderId || photos.length === 0 || !selectedStyle)
            return;
        setGenerating(true);
        setVideoState("generating");
        try {
            // Create FormData with photos
            const formData = new FormData();
            photos.forEach((photo) => {
                formData.append("photos", photo);
            });
            formData.append("videoStyle", selectedStyle);
            await api.post(`/api/orders/${orderId}/video`, {
                videoStyle: selectedStyle,
                photoCount: photos.length,
            });
            // Start polling for completion
            pollIntervalRef.current = setInterval(pollVideoStatus, 3000);
        }
        catch {
            setVideoState("upload");
            setGenerating(false);
        }
    }, [orderId, photos, selectedStyle, pollVideoStatus]);
    if (videoState === "generating") {
        return (_jsx(LoadingScreen, { messages: loadingMessages, currentIndex: loadingMessageIndex }));
    }
    return (_jsx(Shell, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "min-h-screen px-4 py-12", children: _jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, className: "mb-8", children: _jsxs("button", { type: "button", onClick: () => navigate(-1), className: "flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), t("video.back", "Back")] }) }), _jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "visible", className: "mb-10 text-center", children: [_jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--glass-bg)] px-4 py-2 backdrop-blur-sm", children: [_jsx(Video, { className: "h-4 w-4 text-[var(--color-primary)]" }), _jsx("span", { className: "text-sm font-medium text-[var(--text-muted)]", children: t("video.badge", "Video Creation") })] }), _jsx(GradientText, { as: "h1", className: "mb-3 text-3xl font-extrabold sm:text-4xl", children: videoState === "complete"
                                    ? t("video.titleComplete", "Your Video is Ready!")
                                    : t("video.title", "Create Your Video") }), _jsx("p", { className: "mx-auto max-w-md text-[var(--text-muted)]", children: videoState === "complete"
                                    ? t("video.subtitleComplete", "Watch your personalized birthday video below.")
                                    : t("video.subtitle", "Upload photos and choose a style to create a stunning music video.") })] }), _jsxs(AnimatePresence, { mode: "wait", children: [videoState === "upload" && (_jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", exit: { opacity: 0, y: -20 }, className: "space-y-8", children: [_jsx(motion.div, { variants: fadeUp, children: _jsxs(Card, { hoverable: false, className: "p-6", children: [_jsxs("div", { className: "mb-4 flex items-center gap-2", children: [_jsx(Image, { className: "h-5 w-5 text-[var(--color-primary)]" }), _jsx("h3", { className: "text-lg font-bold text-[var(--text)]", children: t("video.photos.title", "Upload Photos") }), _jsx("span", { className: "ml-auto text-sm text-[var(--text-muted)]", children: t("video.photos.count", "{{count}}/10", {
                                                                count: photos.length,
                                                            }) })] }), _jsx(PhotoUploader, { maxPhotos: 10, photos: photos, onChange: handlePhotosChange }), _jsx("p", { className: "mt-3 text-xs text-[var(--text-muted)]", children: t("video.photos.hint", "Drag & drop up to 10 photos. Best results with clear, well-lit images.") })] }) }), _jsx(motion.div, { variants: fadeUp, children: _jsxs(Card, { hoverable: false, className: "p-6", children: [_jsxs("div", { className: "mb-4 flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-5 w-5 text-[var(--color-primary)]" }), _jsx("h3", { className: "text-lg font-bold text-[var(--text)]", children: t("video.style.title", "Choose a Style") })] }), _jsx(StyleGrid, { styles: VIDEO_STYLES, selectedId: selectedStyle, onSelect: handleStyleSelect })] }) }), _jsxs(motion.div, { variants: fadeUp, className: "text-center", children: [_jsx(Button, { size: "lg", onClick: handleGenerate, disabled: photos.length === 0 || !selectedStyle, loading: generating, icon: _jsx(Video, { className: "h-5 w-5" }), className: "px-10 py-5 text-lg font-bold", children: t("video.generate", "Generate Video") }), (photos.length === 0 || !selectedStyle) && (_jsx("p", { className: "mt-3 text-sm text-[var(--text-muted)]", children: photos.length === 0 && !selectedStyle
                                                    ? t("video.generateHint.both", "Upload photos and select a style to continue")
                                                    : photos.length === 0
                                                        ? t("video.generateHint.photos", "Upload at least one photo to continue")
                                                        : t("video.generateHint.style", "Select a video style to continue") }))] })] }, "upload")), videoState === "complete" && videoData && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [_jsx("div", { className: "flex justify-center", children: _jsxs(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: {
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                            }, className: "flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-green-400", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm font-medium", children: t("video.complete", "Video generated successfully!") })] }) }), _jsx(Card, { hoverable: false, className: "overflow-hidden p-0", children: videoData.videoUrl && (_jsx(VideoPlayer, { src: videoData.videoUrl })) }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsx(Button, { size: "lg", onClick: () => window.open(videoData.videoUrl ?? "#", "_blank"), icon: _jsx(Download, { className: "h-5 w-5" }), children: t("video.download", "Download Video") }), _jsx(Button, { variant: "secondary", size: "lg", onClick: () => navigate(`/success?orderId=${orderId}`), children: t("video.backToSuccess", "Back to Song") })] })] }, "complete"))] })] }) }) }));
}
