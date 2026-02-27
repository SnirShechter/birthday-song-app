import { type ReactNode } from "react";
export interface DialogProps {
    /** Whether the dialog is open */
    open: boolean;
    /** Called when the dialog should close */
    onClose: () => void;
    /** Dialog title */
    title?: ReactNode;
    /** Dialog description below the title */
    description?: ReactNode;
    /** Dialog body content */
    children?: ReactNode;
    /** Footer actions */
    footer?: ReactNode;
    /** Max width class (default max-w-lg) */
    maxWidth?: string;
    /** Hide the close button */
    hideCloseButton?: boolean;
    /** Additional class for the dialog panel */
    className?: string;
}
declare function Dialog({ open, onClose, title, description, children, footer, maxWidth, hideCloseButton, className, }: DialogProps): import("react/jsx-runtime").JSX.Element;
declare namespace Dialog {
    var displayName: string;
}
export { Dialog };
//# sourceMappingURL=Dialog.d.ts.map