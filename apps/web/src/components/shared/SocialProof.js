import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { cn } from "../../lib/cn";
function useCountUp(target, duration) {
    const [current, setCurrent] = useState(0);
    const frameRef = useRef();
    const startTimeRef = useRef(null);
    useEffect(() => {
        startTimeRef.current = null;
        const animate = (timestamp) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp;
            }
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.floor(eased * target));
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameRef.current)
                cancelAnimationFrame(frameRef.current);
        };
    }, [target, duration]);
    return current;
}
function formatNumber(num) {
    return num.toLocaleString("en-US");
}
function SocialProof({ count = 2347, duration = 2000, label = "songs created this week", className, }) {
    const displayCount = useCountUp(count, duration);
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5, duration: 0.5 }, className: cn("inline-flex items-center gap-2 rounded-full px-4 py-2", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border border-[var(--glass-border)]", "text-sm text-[var(--text-muted)]", className), children: [_jsx(Music, { className: "h-4 w-4 text-[var(--color-primary)]" }), _jsxs("span", { children: [_jsx("span", { className: "font-bold tabular-nums text-[var(--text)]", children: formatNumber(displayCount) }), " ", label] })] }));
}
SocialProof.displayName = "SocialProof";
export { SocialProof };
