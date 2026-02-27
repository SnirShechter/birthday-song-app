"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Waveform } from "./Waveform";

export interface AudioPlayerState {
  currentTrackUrl: string | null;
  currentTrackLabel: string;
  isPlaying: boolean;
  progress: number;
}

export interface AudioPlayerActions {
  play: (url: string, label: string) => void;
  pause: () => void;
  toggle: () => void;
  seek: (progress: number) => void;
  setProgress: (progress: number) => void;
  close: () => void;
}

export interface AudioPlayerProps {
  state: AudioPlayerState;
  actions: AudioPlayerActions;
}

function formatTime(seconds: number): string {
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
export function AudioPlayer({ state, actions }: AudioPlayerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { currentTrackUrl, currentTrackLabel, isPlaying, progress } = state;
  const { toggle, seek, setProgress, close } = actions;

  // Simulate playback with a timer
  useEffect(() => {
    if (isPlaying && currentTrackUrl) {
      intervalRef.current = setInterval(() => {
        setProgress(Math.min(progress + 1 / (DEMO_DURATION * 10), 1));
      }, 100);
    } else if (intervalRef.current) {
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

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressBarRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, clickX / rect.width));
      seek(fraction);
    },
    [seek]
  );

  const currentTime = progress * DEMO_DURATION;
  const isVisible = !!currentTrackUrl;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            "h-14",
            "bg-[var(--glass-bg)] backdrop-blur-[20px]",
            "border-t border-[var(--glass-border)]",
            "shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
          )}
        >
          <div className="mx-auto flex h-full max-w-screen-lg items-center gap-3 px-4">
            {/* Play / Pause */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggle}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                "bg-[image:var(--gradient-main)] text-white",
                "shadow-md shadow-[var(--color-primary)]/30",
                "cursor-pointer"
              )}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
              )}
            </motion.button>

            {/* Track label */}
            <span className="min-w-0 flex-shrink truncate text-sm font-medium text-[var(--text)]">
              {currentTrackLabel || "Unknown track"}
            </span>

            {/* Progress bar (clickable/seekable) */}
            <div className="flex flex-1 items-center gap-2">
              <span className="text-xs tabular-nums text-[var(--text-muted)] w-9 text-right">
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressBarRef}
                onClick={handleProgressClick}
                className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-[var(--border)]"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--gradient-main)]"
                  style={{ width: `${progress * 100}%` }}
                  layout
                  transition={{ duration: 0.1 }}
                />
                {/* Thumb */}
                <motion.div
                  className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md border border-[var(--color-primary)]/30"
                  style={{ left: `calc(${progress * 100}% - 6px)` }}
                />
              </div>
              <span className="text-xs tabular-nums text-[var(--text-muted)] w-9">
                {formatTime(DEMO_DURATION)}
              </span>
            </div>

            {/* Mini waveform (hidden on small screens) */}
            <div className="hidden sm:block w-24">
              <Waveform
                isPlaying={isPlaying}
                progress={progress}
                barCount={20}
                height={24}
              />
            </div>

            {/* Close button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={close}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Convenience hook that creates a self-contained demo player state.
 * Usage:
 *   const { state, actions } = useDemoPlayer();
 *   <AudioPlayer state={state} actions={actions} />
 */
export function useDemoPlayer() {
  const stateRef = useRef<AudioPlayerState>({
    currentTrackUrl: null,
    currentTrackLabel: "",
    isPlaying: false,
    progress: 0,
  });

  const [, forceRender] = useState(0);
  const update = useCallback(
    (partial: Partial<AudioPlayerState>) => {
      stateRef.current = { ...stateRef.current, ...partial };
      forceRender((n) => n + 1);
    },
    []
  );

  const actions: AudioPlayerActions = useMemo(
    () => ({
      play: (url: string, label: string) =>
        update({ currentTrackUrl: url, currentTrackLabel: label, isPlaying: true, progress: 0 }),
      pause: () => update({ isPlaying: false }),
      toggle: () => update({ isPlaying: !stateRef.current.isPlaying }),
      seek: (progress: number) => update({ progress }),
      setProgress: (progress: number) => update({ progress }),
      close: () =>
        update({ currentTrackUrl: null, currentTrackLabel: "", isPlaying: false, progress: 0 }),
    }),
    [update]
  );

  return { state: stateRef.current, actions };
}
