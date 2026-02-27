import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

export interface LoadingScreenProps {
  /** Override the rotating messages */
  messages?: string[];
  /** Additional class names */
  className?: string;
}

const defaultMessagesEn = [
  "Tuning the instruments...",
  "Writing the perfect melody...",
  "Adding a sprinkle of magic...",
  "Warming up the vocals...",
  "Mixing beats and wishes...",
  "Composing your birthday anthem...",
  "Polishing the high notes...",
  "Almost ready to celebrate!",
];

const defaultMessagesHe = [
  "...מכוונים את הכלים",
  "...כותבים את המנגינה המושלמת",
  "...מוסיפים קצת קסם",
  "...מחממים את הקול",
  "...מערבבים ביטים ואיחולים",
  "...מלחינים את המנון יום ההולדת שלך",
  "!כמעט מוכנים לחגוג",
];

function LoadingScreen({ messages, className }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  const allMessages = messages ?? defaultMessagesEn;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % allMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [allMessages.length]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex flex-col items-center justify-center",
        "bg-[var(--bg)]",
        className
      )}
    >
      {/* Background gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, var(--color-primary), transparent 60%), radial-gradient(ellipse at 70% 50%, var(--color-accent), transparent 60%)",
        }}
      />

      {/* Circular progress indicator */}
      <div className="relative z-10 mb-8">
        <svg
          className="h-20 w-20 animate-spin"
          viewBox="0 0 80 80"
          fill="none"
          style={{ animationDuration: "1.5s" }}
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="var(--glass-border)"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="url(#spinner-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="160"
            strokeDashoffset="100"
          />
          <defs>
            <linearGradient id="spinner-gradient" x1="0" y1="0" x2="80" y2="80">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Rotating message */}
      <div className="relative z-10 h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-base font-medium text-[var(--text)]"
          >
            {allMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Pulsing dots */}
      <div className="relative z-10 mt-6 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="h-2 w-2 rounded-full bg-[image:var(--gradient-main)]"
          />
        ))}
      </div>
    </div>
  );
}

LoadingScreen.displayName = "LoadingScreen";

export { LoadingScreen, defaultMessagesEn, defaultMessagesHe };
