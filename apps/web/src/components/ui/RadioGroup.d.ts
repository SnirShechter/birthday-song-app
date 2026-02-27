import { type ReactNode } from "react";
export interface RadioGroupProps {
    /** Currently selected value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Accessible group label */
    label?: string;
    /** Layout direction */
    direction?: "vertical" | "horizontal";
    children: ReactNode;
    className?: string;
}
declare function RadioGroup({ value, onChange, label, direction, children, className, }: RadioGroupProps): import("react/jsx-runtime").JSX.Element;
declare namespace RadioGroup {
    var Option: typeof RadioOption;
}
export interface RadioOptionProps {
    /** Unique value for this option */
    value: string;
    /** Primary label */
    label: string;
    /** Secondary description */
    description?: string;
    /** Icon or emoji rendered before the label */
    icon?: ReactNode;
    /** Disabled state */
    disabled?: boolean;
    className?: string;
}
declare function RadioOption({ value, label, description, icon, disabled, className, }: RadioOptionProps): import("react/jsx-runtime").JSX.Element;
export { RadioGroup };
//# sourceMappingURL=RadioGroup.d.ts.map