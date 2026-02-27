"use client";

import { type ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ChatBubbleProps {
  type: "ai" | "user";
  children: ReactNode;
  animate?: boolean;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-[var(--color-primary)]"
          animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut" as const,
          }}
        />
      ))}
    </div>
  );
}

export function ChatBubble({
  type,
  children,
  animate = true,
}: ChatBubbleProps) {
  const [showContent, setShowContent] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setShowContent(true);
      return;
    }
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, [animate]);

  const isAI = type === "ai";

  const slideVariants = {
    hidden: {
      opacity: 0,
      x: isAI ? -24 : 24,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      className={cn(
        "flex w-full",
        isAI
          ? "justify-start rtl:justify-start"
          : "justify-end rtl:justify-end"
      )}
      variants={slideVariants}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[70%]",
          isAI && [
            "bg-[var(--glass-bg)]",
            "backdrop-blur-[var(--glass-blur)]",
            "border border-[var(--glass-border)]",
            "shadow-[var(--glass-shadow)]",
            "border-l-[3px] border-l-[var(--color-primary)] rtl:border-l-0 rtl:border-r-[3px] rtl:border-r-[var(--color-primary)]",
            "text-[var(--text)]",
          ],
          !isAI && [
            "bg-[image:var(--gradient-main)]",
            "text-white",
            "shadow-lg shadow-[var(--color-primary)]/20",
          ]
        )}
      >
        <AnimatePresence mode="wait">
          {!showContent && isAI ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <TypingDots />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={animate ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
