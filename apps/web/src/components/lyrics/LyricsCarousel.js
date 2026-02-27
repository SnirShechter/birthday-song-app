"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { cn } from "@/lib/cn";
import { LyricsCard } from "./LyricsCard";
export function LyricsCarousel({ variations, onSelect, onEdit, selectedId, }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
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
    const snapTo = (index) => {
        const clamped = Math.max(0, Math.min(index, totalCards - 1));
        setActiveIndex(clamped);
        controls.start({
            x: -(clamped * (cardWidth + gap)),
            transition: { type: "spring", stiffness: 300, damping: 30 },
        });
    };
    const handleDragEnd = (_, info) => {
        const threshold = cardWidth / 4;
        const velocity = info.velocity.x;
        const offset = info.offset.x;
        let newIndex = activeIndex;
        if (offset < -threshold || velocity < -300) {
            newIndex = activeIndex + 1;
        }
        else if (offset > threshold || velocity > 300) {
            newIndex = activeIndex - 1;
        }
        snapTo(newIndex);
    };
    if (variations.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("p", { className: "text-sm text-[var(--text-muted)]", children: "No lyrics variations available yet." }) }));
    }
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("div", { ref: containerRef, className: "relative overflow-hidden px-4", children: _jsx(motion.div, { className: "flex", style: { x, gap: `${gap}px` }, drag: "x", dragConstraints: {
                        left: -((totalCards - 1) * (cardWidth + gap)),
                        right: 0,
                    }, dragElastic: 0.15, onDragEnd: handleDragEnd, animate: controls, children: variations.map((v) => (_jsx(motion.div, { className: "shrink-0", style: { width: cardWidth || "100%" }, children: _jsx(LyricsCard, { variation: v, isSelected: selectedId === v.id, onSelect: () => onSelect(v.id), onEdit: (content) => onEdit(v.id, content) }) }, v.id))) }) }), totalCards > 1 && (_jsx("div", { className: "flex items-center justify-center gap-2", children: variations.map((_, i) => (_jsx(motion.button, { onClick: () => snapTo(i), className: cn("rounded-full transition-all duration-300 cursor-pointer", i === activeIndex
                        ? "h-2.5 w-8 bg-[image:var(--gradient-main)]"
                        : "h-2.5 w-2.5 bg-[var(--border)] hover:bg-[var(--text-muted)]"), whileTap: { scale: 0.9 }, "aria-label": `Go to variation ${i + 1}` }, i))) }))] }));
}
