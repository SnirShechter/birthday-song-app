import type { Order, MusicStyle, LyricsVariation, SongVariation, VideoClip, PaymentStatus } from '@birthday-song/shared';
type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';
interface OrderState {
    orderId: string | null;
    order: Order | null;
    step: number;
    answers: Record<string, unknown>;
    selectedStyle: MusicStyle | null;
    lyrics: LyricsVariation[];
    selectedLyricsId: number | null;
    songs: SongVariation[];
    selectedSongId: number | null;
    video: VideoClip | null;
    paymentStatus: PaymentStatus | null;
    generationStatus: GenerationStatus;
    setOrderId: (id: string) => void;
    setOrder: (order: Order) => void;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setAnswer: (key: string, value: unknown) => void;
    setAnswers: (answers: Record<string, unknown>) => void;
    setStyle: (style: MusicStyle) => void;
    setLyrics: (lyrics: LyricsVariation[]) => void;
    selectLyrics: (id: number) => void;
    updateLyricsContent: (id: number, content: string) => void;
    setSongs: (songs: SongVariation[]) => void;
    selectSong: (id: number) => void;
    setVideo: (video: VideoClip) => void;
    setPaymentStatus: (status: PaymentStatus) => void;
    setGenerationStatus: (status: GenerationStatus) => void;
    reset: () => void;
}
export declare const useOrderStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<OrderState>, "setState" | "persist"> & {
    setState(partial: OrderState | Partial<OrderState> | ((state: OrderState) => OrderState | Partial<OrderState>), replace?: false | undefined): unknown;
    setState(state: OrderState | ((state: OrderState) => OrderState), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<OrderState, {
            orderId: string | null;
            step: number;
            answers: Record<string, unknown>;
            selectedStyle: MusicStyle | null;
            selectedLyricsId: number | null;
            selectedSongId: number | null;
            paymentStatus: PaymentStatus | null;
        }, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: OrderState) => void) => () => void;
        onFinishHydration: (fn: (state: OrderState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<OrderState, {
            orderId: string | null;
            step: number;
            answers: Record<string, unknown>;
            selectedStyle: MusicStyle | null;
            selectedLyricsId: number | null;
            selectedSongId: number | null;
            paymentStatus: PaymentStatus | null;
        }, unknown>>;
    };
}>;
export {};
//# sourceMappingURL=order.d.ts.map