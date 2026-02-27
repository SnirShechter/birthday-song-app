import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const initialState = {
    orderId: null,
    order: null,
    step: 0,
    answers: {},
    selectedStyle: null,
    lyrics: [],
    selectedLyricsId: null,
    songs: [],
    selectedSongId: null,
    video: null,
    paymentStatus: null,
    generationStatus: 'idle',
};
export const useOrderStore = create()(persist((set, get) => ({
    ...initialState,
    setOrderId: (orderId) => set({ orderId }),
    setOrder: (order) => set({ order }),
    setStep: (step) => set({ step }),
    nextStep: () => set((s) => ({ step: s.step + 1 })),
    prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
    setAnswer: (key, value) => set((s) => ({
        answers: { ...s.answers, [key]: value },
    })),
    setAnswers: (answers) => set((s) => ({
        answers: { ...s.answers, ...answers },
    })),
    setStyle: (selectedStyle) => set({ selectedStyle }),
    setLyrics: (lyrics) => set({ lyrics }),
    selectLyrics: (id) => set((s) => ({
        selectedLyricsId: id,
        lyrics: s.lyrics.map((l) => ({
            ...l,
            selected: l.id === id,
        })),
    })),
    updateLyricsContent: (id, content) => set((s) => ({
        lyrics: s.lyrics.map((l) => l.id === id ? { ...l, editedContent: content } : l),
    })),
    setSongs: (songs) => set({ songs }),
    selectSong: (id) => set((s) => ({
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
}), {
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
}));
