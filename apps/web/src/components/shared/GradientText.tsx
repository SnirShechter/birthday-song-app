import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface GradientTextProps {
  children: ReactNode;
  /** Custom gradient CSS value */
  gradient?: string;
  /** HTML element tag */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  className?: string;
}

function GradientText({
  children,
  gradient,
  as: Tag = "span",
  className,
}: GradientTextProps) {
  return (
    <>
      <Tag
        className={cn(
          "inline-block bg-clip-text text-transparent",
          "animate-[gradientShift_8s_ease_infinite]",
          "bg-[length:200%_200%]",
          className
        )}
        style={{
          backgroundImage:
            gradient ??
            "linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-energy), var(--color-accent), var(--color-primary))",
        }}
      >
        {children}
      </Tag>

      {/* Inject keyframes -- only rendered once per React tree */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}

GradientText.displayName = "GradientText";

export { GradientText };
