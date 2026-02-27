import type { ProductType } from "@birthday-song/shared";
export interface TierSelectorProps {
    selectedTier?: ProductType;
    onSelect: (tier: ProductType) => void;
}
export declare function TierSelector({ selectedTier, onSelect }: TierSelectorProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TierSelector.d.ts.map