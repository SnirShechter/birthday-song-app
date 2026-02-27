import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
interface BaseInputProps {
    label?: string;
    error?: string;
    hint?: string;
}
export interface InputFieldProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    as?: "input";
}
export interface TextareaFieldProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
    as: "textarea";
    rows?: number;
}
export type InputProps = InputFieldProps | TextareaFieldProps;
declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;
export { Input };
//# sourceMappingURL=Input.d.ts.map