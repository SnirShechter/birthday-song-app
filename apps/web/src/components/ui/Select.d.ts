export interface SelectOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}
export interface SelectProps {
    /** Available options */
    options: SelectOption[];
    /** Currently selected value */
    value?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Floating label */
    label?: string;
    /** Placeholder when no value selected */
    placeholder?: string;
    /** Error message */
    error?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className */
    className?: string;
}
declare const Select: import("react").ForwardRefExoticComponent<SelectProps & import("react").RefAttributes<HTMLButtonElement>>;
export { Select };
//# sourceMappingURL=Select.d.ts.map