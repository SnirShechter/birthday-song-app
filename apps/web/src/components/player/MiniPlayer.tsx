"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/cn";
import { Waveform } from "./Waveform";

export interface MiniPlayerProps {
  url: string;
  label: string;
  previewDuration?: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MiniPlayer({
  url,
  label,
  previewDuration = 10,
}: MiniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1 / (previewDuration * 10);
          if (next >= 1) {
            setIsPlaying(false);
            return 1;
          }
          return next;
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, previewDuration]);

  const handleToggle = useCallback(() => {
    if (progress >= 1) {
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [progress]);

  const currentTime = progress * previewDuration;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2",
        "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
        "border border-[var(--glass-border)]"
      )}
    >
      {/* Play/Pause button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          "bg-[image:var(--gradient-main)] text-white",
          "shadow-sm shadow-[var(--color-primary)]/25",
          "cursor-pointer"
        )}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5" fill="currentColor" />
        ) : (
          <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" />
        )}
      </motion.button>

      {/* Waveform */}
      <div className="flex-1 min-w-0">
        <Waveform
          isPlaying={isPlaying}
          progress={progress}
          barCount={24}
          height={24}
        />
      </div>

      {/* Duration text */}
      <span className="shrink-0 text-xs tabular-nums text-[var(--text-muted)]">
        {formatTime(currentTime)}/{formatTime(previewDuration)}
      </span>
    </div>
  );
}
