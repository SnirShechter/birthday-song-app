import { create } from 'zustand';
import { Howl } from 'howler';
let howlInstance = null;
let rafId = null;
function cleanupHowl() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (howlInstance) {
        howlInstance.unload();
        howlInstance = null;
    }
}
function startProgressLoop(set) {
    function update() {
        if (howlInstance && howlInstance.playing()) {
            const seek = howlInstance.seek();
            const duration = howlInstance.duration();
            set({
                progress: duration > 0 ? seek / duration : 0,
                duration,
            });
            rafId = requestAnimationFrame(update);
        }
    }
    rafId = requestAnimationFrame(update);
}
export const usePlayerStore = create()((set, get) => ({
    currentTrackUrl: null,
    currentTrackLabel: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    play: (url, label) => {
        const state = get();
        // If same track, just resume
        if (state.currentTrackUrl === url && howlInstance) {
            howlInstance.play();
            set({ isPlaying: true });
            startProgressLoop(set);
            return;
        }
        // Different track — destroy old and create new
        cleanupHowl();
        howlInstance = new Howl({
            src: [url],
            html5: true,
            onplay: () => {
                set({
                    isPlaying: true,
                    duration: howlInstance?.duration() ?? 0,
                });
                startProgressLoop(set);
            },
            onpause: () => {
                set({ isPlaying: false });
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            },
            onstop: () => {
                set({ isPlaying: false, progress: 0 });
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            },
            onend: () => {
                set({ isPlaying: false, progress: 1 });
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            },
            onloaderror: (_id, error) => {
                console.error('Howler load error:', error);
                set({ isPlaying: false });
            },
            onplayerror: (_id, error) => {
                console.error('Howler play error:', error);
                set({ isPlaying: false });
            },
        });
        set({
            currentTrackUrl: url,
            currentTrackLabel: label ?? null,
            progress: 0,
            duration: 0,
        });
        howlInstance.play();
    },
    pause: () => {
        howlInstance?.pause();
    },
    toggle: () => {
        const state = get();
        if (state.isPlaying) {
            state.pause();
        }
        else if (state.currentTrackUrl) {
            state.play(state.currentTrackUrl, state.currentTrackLabel ?? undefined);
        }
    },
    seek: (position) => {
        if (howlInstance) {
            const duration = howlInstance.duration();
            howlInstance.seek(position * duration);
            set({ progress: position });
        }
    },
    setProgress: (progress) => {
        set({ progress });
    },
    stop: () => {
        cleanupHowl();
        set({
            currentTrackUrl: null,
            currentTrackLabel: null,
            isPlaying: false,
            progress: 0,
            duration: 0,
        });
    },
}));
