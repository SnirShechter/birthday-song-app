import { createContext, useContext, useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroup.Option must be used inside RadioGroup");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* RadioGroup                                                          */
/* ------------------------------------------------------------------ */

export interface RadioGroupProps {
  /** Currently selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Accessible group label */
  label?: string;
  /** Layout direction */
  direction?: "vertical" | "horizontal";
  children: ReactNode;
  className?: string;
}

function RadioGroup({
  value,
  onChange,
  label,
  direction = "vertical",
  children,
  className,
}: RadioGroupProps) {
  const groupName = useId();

  return (
    <RadioGroupContext.Provider value={{ name: groupName, value, onChange }}>
      <fieldset
        aria-label={label}
        className={cn(
          "flex gap-3",
          direction === "vertical" ? "flex-col" : "flex-row flex-wrap",
          className
        )}
      >
        {label && (
          <legend className="mb-2 text-sm font-medium text-[var(--text-muted)]">
            {label}
          </legend>
        )}
        {children}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* RadioGroup.Option                                                   */
/* ------------------------------------------------------------------ */

export interface RadioOptionProps {
  /** Unique value for this option */
  value: string;
  /** Primary label */
  label: string;
  /** Secondary description */
  description?: string;
  /** Icon or emoji rendered before the label */
  icon?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  className?: string;
}

function RadioOption({
  value,
  label,
  description,
  icon,
  disabled = false,
  className,
}: RadioOptionProps) {
  const { name, value: selectedValue, onChange } = useRadioGroup();
  const isSelected = selectedValue === value;
  const optionId = useId();

  return (
    <motion.label
      htmlFor={optionId}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "relative flex items-center gap-3 p-4 rounded-xl cursor-pointer",
        "transition-all duration-200 ease-out",
        "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
        "border-2",
        isSelected
          ? "border-transparent shadow-lg shadow-[var(--color-primary)]/15"
          : "border-[var(--glass-border)] hover:border-[var(--border)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Gradient border ring when selected */}
      {isSelected && (
        <motion.div
          layoutId={`radio-ring-${name}`}
          className="absolute inset-0 rounded-xl border-2 border-transparent bg-clip-border"
          style={{
            background: "linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box, var(--gradient-main) border-box",
            borderColor: "transparent",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}

      <input
        type="radio"
        id={optionId}
        name={name}
        value={value}
        checked={isSelected}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      {/* Radio indicator */}
      <div
        className={cn(
          "relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
          isSelected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
            : "border-[var(--text-muted)]"
        )}
      >
        <motion.div
          initial={false}
          animate={isSelected ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="h-2 w-2 rounded-full bg-white"
        />
      </div>

      {/* Icon */}
      {icon && (
        <span className="relative z-10 shrink-0 text-xl">{icon}</span>
      )}

      {/* Text */}
      <div className="relative z-10 flex flex-col">
        <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
        {description && (
          <span className="text-xs text-[var(--text-muted)] mt-0.5">
            {description}
          </span>
        )}
      </div>
    </motion.label>
  );
}

RadioGroup.Option = RadioOption;

export { RadioGroup };
