"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useMemo } from "react";
export function Waveform({ isPlaying, progress, barCount = 40, height = 32, }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(0);
    const startTimeRef = useRef(0);
    // Generate randomized base bar heights (stable across renders)
    const barHeights = useMemo(() => {
        const heights = [];
        // Use a simple seeded pseudo-random for stability
        let seed = 42;
        for (let i = 0; i < barCount; i++) {
            seed = (seed * 16807 + 0) % 2147483647;
            heights.push(0.2 + (seed / 2147483647) * 0.8);
        }
        return heights;
    }, [barCount]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const w = rect.width;
        const h = rect.height;
        const barWidth = Math.max(2, (w / barCount) * 0.6);
        const barGap = (w - barWidth * barCount) / (barCount - 1 || 1);
        const animateScales = [0.3, 1, 0.5, 0.8, 0.4];
        const cycleDuration = 1200;
        const draw = (timestamp) => {
            if (!startTimeRef.current)
                startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            ctx.clearRect(0, 0, w, h);
            // Gradient colors
            const primaryHex = "#7C3AED";
            const accentHex = "#EC4899";
            const mutedHex = "#6B7280";
            for (let i = 0; i < barCount; i++) {
                let baseHeight = barHeights[i];
                const xPos = i * (barWidth + barGap);
                const barProgress = i / barCount;
                // Animate bars when playing
                if (isPlaying) {
                    const phase = ((elapsed + i * 80) % cycleDuration) / cycleDuration;
                    const scaleIndex = Math.floor(phase * animateScales.length);
                    const nextScaleIndex = (scaleIndex + 1) % animateScales.length;
                    const t = (phase * animateScales.length) % 1;
                    const scale = animateScales[scaleIndex] * (1 - t) +
                        animateScales[nextScaleIndex] * t;
                    baseHeight = baseHeight * (0.4 + scale * 0.6);
                }
                const bh = baseHeight * h * 0.85;
                const y = (h - bh) / 2;
                // Color based on progress
                if (barProgress <= progress) {
                    const grad = ctx.createLinearGradient(xPos, y, xPos, y + bh);
                    grad.addColorStop(0, primaryHex);
                    grad.addColorStop(1, accentHex);
                    ctx.fillStyle = grad;
                }
                else {
                    ctx.fillStyle = mutedHex + "40"; // muted with alpha
                }
                // Draw rounded bar
                const radius = barWidth / 2;
                ctx.beginPath();
                ctx.moveTo(xPos + radius, y);
                ctx.lineTo(xPos + barWidth - radius, y);
                ctx.quadraticCurveTo(xPos + barWidth, y, xPos + barWidth, y + radius);
                ctx.lineTo(xPos + barWidth, y + bh - radius);
                ctx.quadraticCurveTo(xPos + barWidth, y + bh, xPos + barWidth - radius, y + bh);
                ctx.lineTo(xPos + radius, y + bh);
                ctx.quadraticCurveTo(xPos, y + bh, xPos, y + bh - radius);
                ctx.lineTo(xPos, y + radius);
                ctx.quadraticCurveTo(xPos, y, xPos + radius, y);
                ctx.closePath();
                ctx.fill();
            }
            if (isPlaying) {
                animationRef.current = requestAnimationFrame(draw);
            }
        };
        // Always do an initial draw
        animationRef.current = requestAnimationFrame(draw);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, progress, barCount, barHeights, height]);
    return (_jsx("canvas", { ref: canvasRef, className: "w-full", style: { height: `${height}px` } }));
}
