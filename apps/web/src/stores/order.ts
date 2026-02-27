import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Order,
  MusicStyle,
  LyricsVariation,
  SongVariation,
  VideoClip,
  PaymentStatus,
} from '@birthday-song/shared';

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

  // Actions
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

const initialState = {
  orderId: null as string | null,
  order: null as Order | null,
  step: 0,
  answers: {} as Record<string, unknown>,
  selectedStyle: null as MusicStyle | null,
  lyrics: [] as LyricsVariation[],
  selectedLyricsId: null as number | null,
  songs: [] as SongVariation[],
  selectedSongId: null as number | null,
  video: null as VideoClip | null,
  paymentStatus: null as PaymentStatus | null,
  generationStatus: 'idle' as GenerationStatus,
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOrderId: (orderId) => set({ orderId }),

      setOrder: (order) => set({ order }),

      setStep: (step) => set({ step }),

      nextStep: () => set((s) => ({ step: s.step + 1 })),

      prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

      setAnswer: (key, value) =>
        set((s) => ({
          answers: { ...s.answers, [key]: value },
        })),

      setAnswers: (answers) =>
        set((s) => ({
          answers: { ...s.answers, ...answers },
        })),

      setStyle: (selectedStyle) => set({ selectedStyle }),

      setLyrics: (lyrics) => set({ lyrics }),

      selectLyrics: (id) =>
        set((s) => ({
          selectedLyricsId: id,
          lyrics: s.lyrics.map((l) => ({
            ...l,
            selected: l.id === id,
          })),
        })),

      updateLyricsContent: (id, content) =>
        set((s) => ({
          lyrics: s.lyrics.map((l) =>
            l.id === id ? { ...l, editedContent: content } : l,
          ),
        })),

      setSongs: (songs) => set({ songs }),

      selectSong: (id) =>
        set((s) => ({
          selectedSongId: id,
          songs: s.songs.map((song) => ({
            ...song,
            selected: song.id === id,
          })),
        })),

      setVideo: (video) => set({ video }),

      setPaymentStatus: (paymentStatus) => set({ paymentStatus }),

      setGenerationStatus: (generationStatus) => set({ generationStatus }),

      reset: () => set(initialState),
    }),
    {
      name: 'birthday-song-order',
      partialize: (state) => ({
        orderId: state.orderId,
        step: state.step,
        answers: state.answers,
        selectedStyle: state.selectedStyle,
        selectedLyricsId: state.selectedLyricsId,
        selectedSongId: state.selectedSongId,
        paymentStatus: state.paymentStatus,
      }),
    },
  ),
);
