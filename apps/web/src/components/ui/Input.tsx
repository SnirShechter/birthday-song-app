import {
  forwardRef,
  useState,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

interface BaseInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export interface InputFieldProps
  extends BaseInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  as?: "input";
}

export interface TextareaFieldProps
  extends BaseInputProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  as: "textarea";
  rows?: number;
}

export type InputProps = InputFieldProps | TextareaFieldProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (props, ref) => {
    const {
      as = "input",
      label,
      error,
      hint,
      className,
      disabled,
      id: externalId,
      ...restProps
    } = props;

    const generatedId = useId();
    const id = externalId ?? generatedId;
    const [focused, setFocused] = useState(false);

    const hasValue =
      as === "textarea"
        ? Boolean((restProps as TextareaHTMLAttributes<HTMLTextAreaElement>).value)
        : Boolean((restProps as InputHTMLAttributes<HTMLInputElement>).value);

    const isFloating = focused || hasValue;

    const baseClasses = cn(
      "peer w-full rounded-xl px-4 pt-5 pb-2",
      "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
      "border transition-all duration-200 ease-out",
      "text-[var(--text)] placeholder-transparent",
      "outline-none",
      // Default border
      !error && !focused && "border-[var(--glass-border)]",
      // Focus border - gradient ring effect
      !error && focused && "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20",
      // Error border
      error && "border-red-500 ring-2 ring-red-500/20",
      // Disabled
      disabled && "opacity-50 cursor-not-allowed bg-[var(--surface)]",
      className
    );

    const labelClasses = cn(
      "absolute start-4 transition-all duration-200 ease-out pointer-events-none",
      "origin-[0]",
      isFloating
        ? "top-1.5 text-xs font-medium"
        : "top-1/2 -translate-y-1/2 text-base",
      error
        ? "text-red-400"
        : focused
          ? "text-[var(--color-primary)]"
          : "text-[var(--text-muted)]"
    );

    return (
      <div className="relative w-full">
        <div className="relative">
          {as === "textarea" ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={id}
              disabled={disabled}
              onFocus={(e) => {
                setFocused(true);
                (restProps as TextareaHTMLAttributes<HTMLTextAreaElement>).onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                (restProps as TextareaHTMLAttributes<HTMLTextAreaElement>).onBlur?.(e);
              }}
              rows={(props as TextareaFieldProps).rows ?? 4}
              className={cn(baseClasses, "resize-y min-h-[100px]")}
              placeholder={label ?? " "}
              {...(restProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={id}
              disabled={disabled}
              onFocus={(e) => {
                setFocused(true);
                (restProps as InputHTMLAttributes<HTMLInputElement>).onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                (restProps as InputHTMLAttributes<HTMLInputElement>).onBlur?.(e);
              }}
              className={baseClasses}
              placeholder={label ?? " "}
              {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {label && (
            <label htmlFor={id} className={labelClasses}>
              {label}
            </label>
          )}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mt-1.5 text-sm text-red-400 ps-1"
            >
              {error}
            </motion.p>
          )}
          {!error && hint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1.5 text-sm text-[var(--text-muted)] ps-1"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
