import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

export interface ConfettiProps {
  /** Array of hex color strings */
  colors?: string[];
  /** Number of confetti particles */
  particleCount?: number;
  /** Spread angle in degrees */
  spread?: number;
  /** Whether the burst should fire */
  fire?: boolean;
  /** Origin point, 0-1 for x and y */
  origin?: { x: number; y: number };
}

const defaultColors = ["#7C3AED", "#EC4899", "#F97316"];

function Confetti({
  colors = defaultColors,
  particleCount = 100,
  spread = 70,
  fire = true,
  origin = { x: 0.5, y: 0.6 },
}: ConfettiProps) {
  const burst = useCallback(() => {
    // Fire a burst from left side
    confetti({
      particleCount: Math.floor(particleCount / 2),
      spread,
      origin: { x: origin.x - 0.15, y: origin.y },
      colors,
      startVelocity: 30,
      gravity: 0.8,
      ticks: 200,
      disableForReducedMotion: true,
    });

    // Fire a burst from right side
    confetti({
      particleCount: Math.floor(particleCount / 2),
      spread,
      origin: { x: origin.x + 0.15, y: origin.y },
      colors,
      startVelocity: 30,
      gravity: 0.8,
      ticks: 200,
      disableForReducedMotion: true,
    });
  }, [colors, particleCount, spread, origin]);

  useEffect(() => {
    if (fire) {
      // Small delay to ensure component is visible
      const timer = setTimeout(burst, 100);
      return () => clearTimeout(timer);
    }
  }, [fire, burst]);

  // This component renders nothing; confetti is drawn on the canvas-confetti canvas
  return null;
}

Confetti.displayName = "Confetti";

export { Confetti };
