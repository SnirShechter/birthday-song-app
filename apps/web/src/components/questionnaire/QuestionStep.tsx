"use client";

import { useState, useCallback, type ChangeEvent, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { ChatBubble } from "./ChatBubble";

export interface QuestionConfig {
  id: string;
  type: "text" | "select" | "multiselect" | "number" | "textarea";
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface QuestionStepProps {
  question: QuestionConfig;
  onAnswer: (id: string, value: string | string[] | number) => void;
  initialValue?: string | string[] | number;
}

export function QuestionStep({
  question,
  onAnswer,
  initialValue,
}: QuestionStepProps) {
  const [value, setValue] = useState<string | string[] | number>(
    initialValue ?? (question.type === "multiselect" ? [] : "")
  );
  const [submitted, setSubmitted] = useState(!!initialValue);

  const handleSubmit = useCallback(() => {
    if (question.required && !value) return;
    if (question.required && Array.isArray(value) && value.length === 0) return;
    setSubmitted(true);
    onAnswer(question.id, value);
  }, [value, question, onAnswer]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && question.type !== "textarea") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value === "" ? "" : Number(e.target.value);
    setValue(num);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  const toggleMultiSelect = (option: string) => {
    const arr = Array.isArray(value) ? value : [];
    const next = arr.includes(option)
      ? arr.filter((v) => v !== option)
      : [...arr, option];
    setValue(next);
  };

  const inputBase = cn(
    "w-full rounded-xl px-4 py-3 text-sm",
    "bg-[var(--surface)] text-[var(--text)]",
    "border border-[var(--border)]",
    "placeholder:text-[var(--text-muted)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]",
    "transition-colors duration-200"
  );

  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            className={inputBase}
            placeholder={question.placeholder}
            value={value as string}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            dir="auto"
          />
        );

      case "number":
        return (
          <input
            type="number"
            className={inputBase}
            placeholder={question.placeholder}
            value={value as string | number}
            onChange={handleNumberChange}
            onKeyDown={handleKeyDown}
            min={0}
            max={120}
            dir="ltr"
          />
        );

      case "textarea":
        return (
          <textarea
            className={cn(inputBase, "min-h-[80px] resize-y")}
            placeholder={question.placeholder}
            value={value as string}
            onChange={handleTextChange}
            rows={3}
            dir="auto"
          />
        );

      case "select":
        return (
          <select
            className={cn(inputBase, "cursor-pointer appearance-none")}
            value={value as string}
            onChange={handleSelectChange}
            dir="auto"
          >
            <option value="" disabled>
              {question.placeholder || "Select..."}
            </option>
            {question.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="flex flex-wrap gap-2">
            {question.options?.map((opt) => {
              const selected = Array.isArray(value) && value.includes(opt);
              return (
                <motion.button
                  key={opt}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleMultiSelect(opt)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium",
                    "border transition-all duration-200 cursor-pointer",
                    selected
                      ? "bg-[image:var(--gradient-main)] text-white border-transparent shadow-md shadow-[var(--color-primary)]/20"
                      : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-[var(--color-primary)]/50"
                  )}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        );
    }
  };

  const displayValue = Array.isArray(value)
    ? (value as string[]).join(", ")
    : String(value);

  return (
    <div className="flex flex-col gap-3">
      <ChatBubble type="ai" animate>
        <p className="font-medium">{question.label}</p>
      </ChatBubble>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-2 px-2"
          >
            {renderInput()}
            <div className="flex justify-end rtl:justify-start">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={handleSubmit}
                disabled={
                  question.required &&
                  (Array.isArray(value) ? value.length === 0 : !value)
                }
                className={cn(
                  "rounded-xl px-5 py-2 text-sm font-semibold",
                  "bg-[image:var(--gradient-main)] text-white",
                  "shadow-lg shadow-[var(--color-primary)]/25",
                  "hover:shadow-xl hover:brightness-110",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
                  "transition-all duration-200 cursor-pointer"
                )}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatBubble type="user" animate={false}>
              <p>{displayValue}</p>
            </ChatBubble>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
