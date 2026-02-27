import type { Language, Direction } from '@birthday-song/shared';
type Theme = 'light' | 'dark' | 'system';
interface UIState {
    theme: Theme;
    language: Language;
    direction: Direction;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}
export declare const useUIStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<UIState>, "setState" | "persist"> & {
    setState(partial: UIState | Partial<UIState> | ((state: UIState) => UIState | Partial<UIState>), replace?: false | undefined): unknown;
    setState(state: UIState | ((state: UIState) => UIState), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<UIState, UIState, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: UIState) => void) => () => void;
        onFinishHydration: (fn: (state: UIState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<UIState, UIState, unknown>>;
    };
}>;
export {};
//# sourceMappingURL=ui.d.ts.map