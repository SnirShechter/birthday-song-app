"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}
export function VideoPlayer({ url, poster }) {
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showOverlay, setShowOverlay] = useState(true);
    const hideTimeoutRef = useRef(null);
    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video)
            return;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
            setShowOverlay(false);
        }
        else {
            video.pause();
            setIsPlaying(false);
        }
    }, []);
    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video)
            return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    }, []);
    const handleFullscreen = useCallback(() => {
        const video = videoRef.current;
        if (!video)
            return;
        if (video.requestFullscreen) {
            video.requestFullscreen();
        }
    }, []);
    const handleProgressClick = useCallback((e) => {
        const bar = progressRef.current;
        const video = videoRef.current;
        if (!bar || !video)
            return;
        const rect = bar.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        video.currentTime = fraction * video.duration;
    }, []);
    useEffect(() => {
        const video = videoRef.current;
        if (!video)
            return;
        const onTimeUpdate = () => {
            if (video.duration) {
                setProgress(video.currentTime / video.duration);
                setCurrentTime(video.currentTime);
            }
        };
        const onLoadedMetadata = () => {
            setDuration(video.duration);
        };
        const onEnded = () => {
            setIsPlaying(false);
            setShowOverlay(true);
        };
        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("ended", onEnded);
        return () => {
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("ended", onEnded);
        };
    }, []);
    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        if (hideTimeoutRef.current)
            clearTimeout(hideTimeoutRef.current);
        if (isPlaying) {
            hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    }, [isPlaying]);
    return (_jsxs("div", { className: cn("group relative overflow-hidden rounded-2xl bg-black", "aspect-video w-full"), onMouseMove: handleMouseMove, onMouseLeave: () => {
            if (isPlaying)
                setShowControls(false);
        }, children: [_jsx("video", { ref: videoRef, src: url, poster: poster, className: "h-full w-full object-contain", playsInline: true, onClick: togglePlay }), _jsx(AnimatePresence, { children: showOverlay && (_jsx(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, onClick: togglePlay, className: cn("absolute inset-0 flex items-center justify-center", "bg-black/30 cursor-pointer"), children: _jsx(motion.div, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, className: "flex h-16 w-16 items-center justify-center rounded-full bg-[image:var(--gradient-main)] shadow-xl shadow-[var(--color-primary)]/30", children: _jsx(Play, { className: "h-7 w-7 text-white ml-1", fill: "currentColor" }) }) })) }), _jsx(AnimatePresence, { children: showControls && !showOverlay && (_jsxs(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 }, transition: { duration: 0.2 }, className: cn("absolute bottom-0 left-0 right-0", "bg-black/60 backdrop-blur-[12px]", "px-3 py-2"), children: [_jsx("div", { ref: progressRef, onClick: handleProgressClick, className: "mb-2 h-1 w-full cursor-pointer rounded-full bg-white/20", children: _jsx("div", { className: "h-full rounded-full bg-[image:var(--gradient-main)] transition-[width] duration-100", style: { width: `${progress * 100}%` } }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: togglePlay, className: "text-white hover:text-[var(--color-accent)] transition-colors cursor-pointer", children: isPlaying ? (_jsx(Pause, { className: "h-5 w-5", fill: "currentColor" })) : (_jsx(Play, { className: "h-5 w-5 ml-0.5", fill: "currentColor" })) }), _jsxs("span", { className: "text-xs tabular-nums text-white/80", children: [formatTime(currentTime), " / ", formatTime(duration)] }), _jsx("div", { className: "flex-1" }), _jsx("button", { onClick: toggleMute, className: "text-white/80 hover:text-white transition-colors cursor-pointer", children: isMuted ? (_jsx(VolumeX, { className: "h-4 w-4" })) : (_jsx(Volume2, { className: "h-4 w-4" })) }), _jsx("button", { onClick: handleFullscreen, className: "text-white/80 hover:text-white transition-colors cursor-pointer", children: _jsx(Maximize, { className: "h-4 w-4" }) })] })] })) })] }));
}
