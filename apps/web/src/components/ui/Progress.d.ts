export type ProgressSize = "thin" | "default" | "thick";
export interface ProgressProps {
    /** Progress value from 0 to 100 */
    value: number;
    /** Visual size of the bar */
    size?: ProgressSize;
    /** Accessible label */
    label?: string;
    /** Show percentage text */
    showValue?: boolean;
    /** Additional class names */
    className?: string;
}
declare function Progress({ value, size, label, showValue, className, }: ProgressProps): import("react/jsx-runtime").JSX.Element;
declare namespace Progress {
    var displayName: string;
}
export { Progress };
//# sourceMappingURL=Progress.d.ts.map