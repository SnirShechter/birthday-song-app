import type { LyricsVariation } from "@birthday-song/shared";
export interface LyricsCarouselProps {
    variations: LyricsVariation[];
    onSelect: (id: number) => void;
    onEdit: (id: number, content: string) => void;
    selectedId?: number;
}
export declare function LyricsCarousel({ variations, onSelect, onEdit, selectedId, }: LyricsCarouselProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=LyricsCarousel.d.ts.map