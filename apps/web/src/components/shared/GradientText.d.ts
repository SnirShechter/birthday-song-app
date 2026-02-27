import { type ReactNode } from "react";
export interface GradientTextProps {
    children: ReactNode;
    /** Custom gradient CSS value */
    gradient?: string;
    /** HTML element tag */
    as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
    className?: string;
}
declare function GradientText({ children, gradient, as: Tag, className, }: GradientTextProps): import("react/jsx-runtime").JSX.Element;
declare namespace GradientText {
    var displayName: string;
}
export { GradientText };
//# sourceMappingURL=GradientText.d.ts.map