import { type ReactNode } from "react";
export type BadgeVariant = "default" | "outline" | "muted";
export interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    className?: string;
}
declare function Badge({ variant, children, className }: BadgeProps): import("react/jsx-runtime").JSX.Element;
declare namespace Badge {
    var displayName: string;
}
export { Badge };
//# sourceMappingURL=Badge.d.ts.map