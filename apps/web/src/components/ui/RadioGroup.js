import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
const RadioGroupContext = createContext(null);
function useRadioGroup() {
    const ctx = useContext(RadioGroupContext);
    if (!ctx)
        throw new Error("RadioGroup.Option must be used inside RadioGroup");
    return ctx;
}
function RadioGroup({ value, onChange, label, direction = "vertical", children, className, }) {
    const groupName = useId();
    return (_jsx(RadioGroupContext.Provider, { value: { name: groupName, value, onChange }, children: _jsxs("fieldset", { "aria-label": label, className: cn("flex gap-3", direction === "vertical" ? "flex-col" : "flex-row flex-wrap", className), children: [label && (_jsx("legend", { className: "mb-2 text-sm font-medium text-[var(--text-muted)]", children: label })), children] }) }));
}
function RadioOption({ value, label, description, icon, disabled = false, className, }) {
    const { name, value: selectedValue, onChange } = useRadioGroup();
    const isSelected = selectedValue === value;
    const optionId = useId();
    return (_jsxs(motion.label, { htmlFor: optionId, whileHover: disabled ? undefined : { scale: 1.01 }, whileTap: disabled ? undefined : { scale: 0.99 }, transition: { type: "spring", stiffness: 400, damping: 20 }, className: cn("relative flex items-center gap-3 p-4 rounded-xl cursor-pointer", "transition-all duration-200 ease-out", "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]", "border-2", isSelected
            ? "border-transparent shadow-lg shadow-[var(--color-primary)]/15"
            : "border-[var(--glass-border)] hover:border-[var(--border)]", disabled && "opacity-50 cursor-not-allowed", className), children: [isSelected && (_jsx(motion.div, { layoutId: `radio-ring-${name}`, className: "absolute inset-0 rounded-xl border-2 border-transparent bg-clip-border", style: {
                    background: "linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box, var(--gradient-main) border-box",
                    borderColor: "transparent",
                }, transition: { type: "spring", stiffness: 300, damping: 25 } })), _jsx("input", { type: "radio", id: optionId, name: name, value: value, checked: isSelected, disabled: disabled, onChange: () => onChange(value), className: "sr-only" }), _jsx("div", { className: cn("relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200", isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                    : "border-[var(--text-muted)]"), children: _jsx(motion.div, { initial: false, animate: isSelected ? { scale: 1 } : { scale: 0 }, transition: { type: "spring", stiffness: 500, damping: 30 }, className: "h-2 w-2 rounded-full bg-white" }) }), icon && (_jsx("span", { className: "relative z-10 shrink-0 text-xl", children: icon })), _jsxs("div", { className: "relative z-10 flex flex-col", children: [_jsx("span", { className: "text-sm font-semibold text-[var(--text)]", children: label }), description && (_jsx("span", { className: "text-xs text-[var(--text-muted)] mt-0.5", children: description }))] })] }));
}
RadioGroup.Option = RadioOption;
export { RadioGroup };
