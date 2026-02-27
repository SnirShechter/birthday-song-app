import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/cn";

export type CardVariant = "default" | "solid" | "outlined";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  children?: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: [
    "bg-[var(--glass-bg)]",
    "backdrop-blur-[var(--glass-blur)]",
    "border border-[var(--glass-border)]",
  ].join(" "),
  solid: [
    "bg-[var(--surface)]",
    "border border-[var(--border)]",
  ].join(" "),
  outlined: [
    "bg-transparent",
    "border-2 border-[var(--border)]",
  ].join(" "),
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", hoverable = true, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          hoverable
            ? {
                scale: 1.02,
                boxShadow: "0 8px 32px rgba(124, 58, 237, 0.15)",
              }
            : undefined
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "rounded-2xl p-6",
          "transition-shadow duration-200",
          variantStyles[variant],
          hoverable && "cursor-pointer",
          className
        )}
        {...(props as HTMLMotionProps<"div">)}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("text-xl font-bold text-[var(--text)]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-[var(--text-muted)]", className)}
      {...props}
    >
      {children}
    </p>
  );
}
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
CardContent.displayName = "CardContent";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn("mt-4 flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
