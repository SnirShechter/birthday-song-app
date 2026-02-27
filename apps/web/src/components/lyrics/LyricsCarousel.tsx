"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimation, PanInfo } from "framer-motion";
import { cn } from "@/lib/cn";
import type { LyricsVariation } from "@birthday-song/shared";
import { LyricsCard } from "./LyricsCard";

export interface LyricsCarouselProps {
  variations: LyricsVariation[];
  onSelect: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  selectedId?: number;
}

export function LyricsCarousel({
  variations,
  onSelect,
  onEdit,
  selectedId,
}: LyricsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // On mobile, full width minus padding. On desktop, cap at 400px
        const width = Math.min(containerWidth - 32, 400);
        setCardWidth(width);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const gap = 16;
  const totalCards = variations.length;

  const snapTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, totalCards - 1));
    setActiveIndex(clamped);
    controls.start({
      x: -(clamped * (cardWidth + gap)),
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = cardWidth / 4;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    let newIndex = activeIndex;
    if (offset < -threshold || velocity < -300) {
      newIndex = activeIndex + 1;
    } else if (offset > threshold || velocity > 300) {
      newIndex = activeIndex - 1;
    }
    snapTo(newIndex);
  };

  if (variations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-[var(--text-muted)]">
          No lyrics variations available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Carousel container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden px-4"
      >
        <motion.div
          className="flex"
          style={{ x, gap: `${gap}px` }}
          drag="x"
          dragConstraints={{
            left: -((totalCards - 1) * (cardWidth + gap)),
            right: 0,
          }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {variations.map((v) => (
            <motion.div
              key={v.id}
              className="shrink-0"
              style={{ width: cardWidth || "100%" }}
            >
              <LyricsCard
                variation={v}
                isSelected={selectedId === v.id}
                onSelect={() => onSelect(v.id)}
                onEdit={(content) => onEdit(v.id, content)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pagination dots */}
      {totalCards > 1 && (
        <div className="flex items-center justify-center gap-2">
          {variations.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => snapTo(i)}
              className={cn(
                "rounded-full transition-all duration-300 cursor-pointer",
                i === activeIndex
                  ? "h-2.5 w-8 bg-[image:var(--gradient-main)]"
                  : "h-2.5 w-2.5 bg-[var(--border)] hover:bg-[var(--text-muted)]"
              )}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to variation ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
