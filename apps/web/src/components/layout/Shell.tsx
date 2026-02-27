import { type ReactNode } from "react";
import { useUIStore } from "../../stores/uiStore";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import { cn } from "../../lib/cn";

export interface ShellProps {
  children: ReactNode;
}

function Shell({ children }: ShellProps) {
  const language = useUIStore((s) => s.language);
  const dir = language === "he" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated gradient mesh background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[var(--bg)]"
      >
        <div className="absolute inset-0 animate-[meshDrift_20s_ease-in-out_infinite] opacity-30">
          <div
            className="absolute top-[-20%] start-[-10%] h-[60%] w-[60%] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
          />
          <div
            className="absolute top-[30%] end-[-15%] h-[50%] w-[50%] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
          />
          <div
            className="absolute bottom-[-20%] start-[30%] h-[45%] w-[55%] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, var(--color-energy), transparent 70%)" }}
          />
        </div>
      </div>

      {/* Top navigation */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full",
          "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
          "border-b border-[var(--glass-border)]"
        )}
      >
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-lg font-bold text-[var(--text)]">
            <span className="text-2xl" role="img" aria-label="birthday cake">
              🎂
            </span>
            <span className="bg-[image:var(--gradient-main)] bg-clip-text text-transparent">
              Birthday Song
            </span>
          </a>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 py-6 text-sm text-[var(--text-muted)] sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Birthday Song. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-[var(--text)] transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[var(--text)] transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>

      {/* Keyframe animation for mesh drift -- injected via style tag */}
      <style>{`
        @keyframes meshDrift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2%, 3%) rotate(1deg); }
          50% { transform: translate(-1%, -2%) rotate(-1deg); }
          75% { transform: translate(3%, -1%) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}

Shell.displayName = "Shell";

export { Shell };
