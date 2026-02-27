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
    origin?: {
        x: number;
        y: number;
    };
}
declare function Confetti({ colors, particleCount, spread, fire, origin, }: ConfettiProps): null;
declare namespace Confetti {
    var displayName: string;
}
export { Confetti };
//# sourceMappingURL=Confetti.d.ts.map