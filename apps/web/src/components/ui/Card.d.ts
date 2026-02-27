import { type HTMLAttributes, type ReactNode } from "react";
export type CardVariant = "default" | "solid" | "outlined";
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    hoverable?: boolean;
    children?: ReactNode;
}
declare const Card: import("react").ForwardRefExoticComponent<CardProps & import("react").RefAttributes<HTMLDivElement>>;
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function CardHeader({ className, children, ...props }: CardHeaderProps): import("react/jsx-runtime").JSX.Element;
declare namespace CardHeader {
    var displayName: string;
}
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
}
declare function CardTitle({ className, children, ...props }: CardTitleProps): import("react/jsx-runtime").JSX.Element;
declare namespace CardTitle {
    var displayName: string;
}
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}
declare function CardDescription({ className, children, ...props }: CardDescriptionProps): import("react/jsx-runtime").JSX.Element;
declare namespace CardDescription {
    var displayName: string;
}
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function CardContent({ className, children, ...props }: CardContentProps): import("react/jsx-runtime").JSX.Element;
declare namespace CardContent {
    var displayName: string;
}
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function CardFooter({ className, children, ...props }: CardFooterProps): import("react/jsx-runtime").JSX.Element;
declare namespace CardFooter {
    var displayName: string;
}
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
//# sourceMappingURL=Card.d.ts.map