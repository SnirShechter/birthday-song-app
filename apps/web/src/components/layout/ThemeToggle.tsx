import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";
import { cn } from "../../lib/cn";

function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl",
        "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
        "border border-[var(--glass-border)]",
        "text-[var(--text-muted)] hover:text-[var(--text)]",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50"
      )}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.div>
    </button>
  );
}

ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
