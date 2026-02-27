import { motion } from "framer-motion";
import { useUIStore } from "../../stores/uiStore";
import { cn } from "../../lib/cn";

function LangToggle() {
  const language = useUIStore((s) => s.language);
  const toggleLanguage = useUIStore((s) => s.toggleLanguage);

  const isHebrew = language === "he";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={isHebrew ? "Switch to English" : "Switch to Hebrew"}
      className={cn(
        "relative flex h-9 min-w-[2.75rem] items-center justify-center rounded-xl px-2",
        "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
        "border border-[var(--glass-border)]",
        "text-[var(--text-muted)] hover:text-[var(--text)]",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50"
      )}
    >
      <motion.span
        key={language}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-xs font-bold tracking-wide"
      >
        {isHebrew ? "EN" : "עב"}
      </motion.span>
    </button>
  );
}

LangToggle.displayName = "LangToggle";

export { LangToggle };
