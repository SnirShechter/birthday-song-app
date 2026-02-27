export interface AudioPlayerState {
    currentTrackUrl: string | null;
    currentTrackLabel: string;
    isPlaying: boolean;
    progress: number;
}
export interface AudioPlayerActions {
    play: (url: string, label: string) => void;
    pause: () => void;
    toggle: () => void;
    seek: (progress: number) => void;
    setProgress: (progress: number) => void;
    close: () => void;
}
export interface AudioPlayerProps {
    state: AudioPlayerState;
    actions: AudioPlayerActions;
}
/**
 * Standalone sticky bottom audio player (56px height).
 * In demo mode, playback is simulated over a 10-second duration.
 * Can also be used with real Zustand player store by passing state/actions props.
 */
export declare function AudioPlayer({ state, actions }: AudioPlayerProps): import("react/jsx-runtime").JSX.Element;
/**
 * Convenience hook that creates a self-contained demo player state.
 * Usage:
 *   const { state, actions } = useDemoPlayer();
 *   <AudioPlayer state={state} actions={actions} />
 */
export declare function useDemoPlayer(): {
    state: AudioPlayerState;
    actions: AudioPlayerActions;
};
//# sourceMappingURL=AudioPlayer.d.ts.map