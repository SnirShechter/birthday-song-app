"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Waveform } from "./Waveform";
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}
const DEMO_DURATION = 10; // seconds
/**
 * Standalone sticky bottom audio player (56px height).
 * In demo mode, playback is simulated over a 10-second duration.
 * Can also be used with real Zustand player store by passing state/actions props.
 */
export function AudioPlayer({ state, actions }) {
    const intervalRef = useRef(null);
    const progressBarRef = useRef(null);
    const { currentTrackUrl, currentTrackLabel, isPlaying, progress } = state;
    const { toggle, seek, setProgress, close } = actions;
    // Simulate playback with a timer
    useEffect(() => {
        if (isPlaying && currentTrackUrl) {
            intervalRef.current = setInterval(() => {
                setProgress(Math.min(progress + 1 / (DEMO_DURATION * 10), 1));
            }, 100);
        }
        else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, currentTrackUrl, progress, setProgress]);
    // Auto-pause at end
    useEffect(() => {
        if (progress >= 1 && isPlaying) {
            actions.pause();
        }
    }, [progress, isPlaying, actions]);
    const handleProgressClick = useCallback((e) => {
        const bar = progressBarRef.current;
        if (!bar)
            return;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const fraction = Math.max(0, Math.min(1, clickX / rect.width));
        seek(fraction);
    }, [seek]);
    const currentTime = progress * DEMO_DURATION;
    const isVisible = !!currentTrackUrl;
    return (_jsx(AnimatePresence, { children: isVisible && (_jsx(motion.div, { initial: { y: 80, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 80, opacity: 0 }, transition: { type: "spring", stiffness: 300, damping: 28 }, className: cn("fixed bottom-0 left-0 right-0 z-50", "h-14", "bg-[var(--glass-bg)] backdrop-blur-[20px]", "border-t border-[var(--glass-border)]", "shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"), children: _jsxs("div", { className: "mx-auto flex h-full max-w-screen-lg items-center gap-3 px-4", children: [_jsx(motion.button, { whileTap: { scale: 0.9 }, onClick: toggle, className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", "bg-[image:var(--gradient-main)] text-white", "shadow-md shadow-[var(--color-primary)]/30", "cursor-pointer"), children: isPlaying ? (_jsx(Pause, { className: "h-4 w-4", fill: "currentColor" })) : (_jsx(Play, { className: "h-4 w-4 ml-0.5", fill: "currentColor" })) }), _jsx("span", { className: "min-w-0 flex-shrink truncate text-sm font-medium text-[var(--text)]", children: currentTrackLabel || "Unknown track" }), _jsxs("div", { className: "flex flex-1 items-center gap-2", children: [_jsx("span", { className: "text-xs tabular-nums text-[var(--text-muted)] w-9 text-right", children: formatTime(currentTime) }), _jsxs("div", { ref: progressBarRef, onClick: handleProgressClick, className: "relative h-1.5 flex-1 cursor-pointer rounded-full bg-[var(--border)]", children: [_jsx(motion.div, { className: "absolute inset-y-0 left-0 rounded-full bg-[image:var(--gradient-main)]", style: { width: `${progress * 100}%` }, layout: true, transition: { duration: 0.1 } }), _jsx(motion.div, { className: "absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md border border-[var(--color-primary)]/30", style: { left: `calc(${progress * 100}% - 6px)` } })] }), _jsx("span", { className: "text-xs tabular-nums text-[var(--text-muted)] w-9", children: formatTime(DEMO_DURATION) })] }), _jsx("div", { className: "hidden sm:block w-24", children: _jsx(Waveform, { isPlaying: isPlaying, progress: progress, barCount: 20, height: 24 }) }), _jsx(motion.button, { whileTap: { scale: 0.9 }, onClick: close, className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] transition-colors cursor-pointer", children: _jsx(X, { className: "h-4 w-4" }) })] }) })) }));
}
/**
 * Convenience hook that creates a self-contained demo player state.
 * Usage:
 *   const { state, actions } = useDemoPlayer();
 *   <AudioPlayer state={state} actions={actions} />
 */
export function useDemoPlayer() {
    const stateRef = useRef({
        currentTrackUrl: null,
        currentTrackLabel: "",
        isPlaying: false,
        progress: 0,
    });
    const [, forceRender] = useState(0);
    const update = useCallback((partial) => {
        stateRef.current = { ...stateRef.current, ...partial };
        forceRender((n) => n + 1);
    }, []);
    const actions = useMemo(() => ({
        play: (url, label) => update({ currentTrackUrl: url, currentTrackLabel: label, isPlaying: true, progress: 0 }),
        pause: () => update({ isPlaying: false }),
        toggle: () => update({ isPlaying: !stateRef.current.isPlaying }),
        seek: (progress) => update({ progress }),
        setProgress: (progress) => update({ progress }),
        close: () => update({ currentTrackUrl: null, currentTrackLabel: "", isPlaying: false, progress: 0 }),
    }), [update]);
    return { state: stateRef.current, actions };
}
