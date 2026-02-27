export interface MockStripeProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
    currency?: string;
    itemLabel: string;
}
export declare function MockStripe({ isOpen, onClose, onSuccess, amount, currency, itemLabel, }: MockStripeProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MockStripe.d.ts.map