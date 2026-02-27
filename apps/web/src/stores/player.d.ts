interface PlayerState {
    currentTrackUrl: string | null;
    currentTrackLabel: string | null;
    isPlaying: boolean;
    progress: number;
    duration: number;
    play: (url: string, label?: string) => void;
    pause: () => void;
    toggle: () => void;
    seek: (position: number) => void;
    setProgress: (progress: number) => void;
    stop: () => void;
}
export declare const usePlayerStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PlayerState>>;
export {};
//# sourceMappingURL=player.d.ts.map