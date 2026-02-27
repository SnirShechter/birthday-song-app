import type { LyricsVariation } from "@birthday-song/shared";
export interface LyricsCardProps {
    variation: LyricsVariation;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: (content: string) => void;
}
export declare function LyricsCard({ variation, isSelected, onSelect, onEdit, }: LyricsCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=LyricsCard.d.ts.map