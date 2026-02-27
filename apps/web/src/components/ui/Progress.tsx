import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

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

const sizeMap: Record<ProgressSize, string> = {
  thin: "h-0.5",
  default: "h-2",
  thick: "h-3",
};

function Progress({
  value,
  size = "default",
  label,
  showValue = false,
  className,
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-[var(--text)]">{label}</span>
          )}
          {showValue && (
            <span className="text-sm tabular-nums text-[var(--text-muted)]">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn(
          "w-full overflow-hidden rounded-full",
          "bg-[var(--surface)] border border-[var(--glass-border)]",
          sizeMap[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            "bg-[image:var(--gradient-main)]"
          )}
        />
      </div>
    </div>
  );
}

Progress.displayName = "Progress";

export { Progress };
