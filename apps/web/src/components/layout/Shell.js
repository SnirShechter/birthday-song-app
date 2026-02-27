import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUIStore } from "../../stores/uiStore";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import { cn } from "../../lib/cn";
function Shell({ children }) {
    const language = useUIStore((s) => s.language);
    const dir = language === "he" ? "rtl" : "ltr";
    return (_jsxs("div", { dir: dir, className: "relative min-h-screen flex flex-col overflow-hidden", children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none fixed inset-0 -z-10 bg-[var(--bg)]", children: _jsxs("div", { className: "absolute inset-0 animate-[meshDrift_20s_ease-in-out_infinite] opacity-30", children: [_jsx("div", { className: "absolute top-[-20%] start-[-10%] h-[60%] w-[60%] rounded-full blur-[100px]", style: { background: "radial-gradient(circle, var(--color-primary), transparent 70%)" } }), _jsx("div", { className: "absolute top-[30%] end-[-15%] h-[50%] w-[50%] rounded-full blur-[100px]", style: { background: "radial-gradient(circle, var(--color-accent), transparent 70%)" } }), _jsx("div", { className: "absolute bottom-[-20%] start-[30%] h-[45%] w-[55%] rounded-full blur-[100px]", style: { background: "radial-gradient(circle, var(--color-energy), transparent 70%)" } })] }) }), _jsx("header", { className: cn("sticky top-0 z-40 w-full", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border-b border-[var(--glass-border)]"), children: _jsxs("nav", { className: "mx-auto flex max-w-4xl items-center justify-between px-4 py-3", children: [_jsxs("a", { href: "/", className: "flex items-center gap-2 text-lg font-bold text-[var(--text)]", children: [_jsx("span", { className: "text-2xl", role: "img", "aria-label": "birthday cake", children: "\uD83C\uDF82" }), _jsx("span", { className: "bg-[image:var(--gradient-main)] bg-clip-text text-transparent", children: "Birthday Song" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(LangToggle, {}), _jsx(ThemeToggle, {})] })] }) }), _jsx("main", { className: "mx-auto w-full max-w-4xl flex-1 px-4 py-8", children: children }), _jsx("footer", { className: "border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", children: _jsxs("div", { className: "mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 py-6 text-sm text-[var(--text-muted)] sm:flex-row sm:justify-between", children: [_jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " Birthday Song. All rights reserved."] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("a", { href: "/privacy", className: "hover:text-[var(--text)] transition-colors", children: "Privacy" }), _jsx("a", { href: "/terms", className: "hover:text-[var(--text)] transition-colors", children: "Terms" })] })] }) }), _jsx("style", { children: `
        @keyframes meshDrift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2%, 3%) rotate(1deg); }
          50% { transform: translate(-1%, -2%) rotate(-1deg); }
          75% { transform: translate(3%, -1%) rotate(0.5deg); }
        }
      ` })] }));
}
Shell.displayName = "Shell";
export { Shell };
