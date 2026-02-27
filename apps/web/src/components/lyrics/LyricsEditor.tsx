"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface LyricsEditorProps {
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const MAX_CHARS = 5000;

export function LyricsEditor({ content, onSave, onCancel }: LyricsEditorProps) {
  const [text, setText] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [text, autoResize]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const remaining = MAX_CHARS - text.length;
  const isOverLimit = remaining < 0;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-3"
    >
      <div
        className={cn(
          "rounded-xl p-1",
          "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
          "border border-[var(--glass-border)]"
        )}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          dir="auto"
          className={cn(
            "w-full resize-none rounded-lg bg-transparent px-4 py-3",
            "text-sm leading-relaxed text-[var(--text)]",
            "placeholder:text-[var(--text-muted)]",
            "focus:outline-none",
            "font-mono"
          )}
          rows={8}
          maxLength={MAX_CHARS + 100}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs",
            isOverLimit ? "text-red-500 font-semibold" : "text-[var(--text-muted)]"
          )}
        >
          {text.length}/{MAX_CHARS}
        </span>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
              "text-[var(--text-muted)] hover:text-[var(--text)]",
              "hover:bg-[var(--glass-bg)]",
              "transition-colors duration-200 cursor-pointer"
            )}
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => onSave(text)}
            disabled={isOverLimit || text.trim().length === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold",
              "bg-[image:var(--gradient-main)] text-white",
              "shadow-md shadow-[var(--color-primary)]/20",
              "hover:shadow-lg hover:brightness-110",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
              "transition-all duration-200 cursor-pointer"
            )}
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
