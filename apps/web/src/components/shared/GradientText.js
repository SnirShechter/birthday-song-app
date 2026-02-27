import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/cn";
function GradientText({ children, gradient, as: Tag = "span", className, }) {
    return (_jsxs(_Fragment, { children: [_jsx(Tag, { className: cn("inline-block bg-clip-text text-transparent", "animate-[gradientShift_8s_ease_infinite]", "bg-[length:200%_200%]", className), style: {
                    backgroundImage: gradient ??
                        "linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-energy), var(--color-accent), var(--color-primary))",
                }, children: children }), _jsx("style", { children: `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      ` })] }));
}
GradientText.displayName = "GradientText";
export { GradientText };
