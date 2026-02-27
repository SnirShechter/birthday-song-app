"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Detect active card on scroll via IntersectionObserver
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || variations.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = cardRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    for (const ref of cardRefs.current) {
      if (ref) observer.observe(ref);
    }

    return () => observer.disconnect();
  }, [variations]);

  const scrollTo = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

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
      {/* Scrollable carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {variations.map((v, i) => (
          <div
            key={v.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="w-[85vw] max-w-[400px] shrink-0 snap-center"
          >
            <LyricsCard
              variation={v}
              isSelected={selectedId === v.id}
              onSelect={() => onSelect(v.id)}
              onEdit={(content) => onEdit(v.id, content)}
            />
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {variations.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {variations.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => scrollTo(i)}
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
