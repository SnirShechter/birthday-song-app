import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n';
function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
    }
    else {
        root.classList.toggle('dark', theme === 'dark');
    }
}
function applyLanguage(lang) {
    const dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    i18n.changeLanguage(lang);
    return dir;
}
export const useUIStore = create()(persist((set, get) => ({
    theme: 'dark',
    language: 'he',
    direction: 'rtl',
    setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
    },
    toggleTheme: () => {
        const current = get().theme;
        const next = current === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
    },
    setLanguage: (language) => {
        const direction = applyLanguage(language);
        set({ language, direction });
    },
    toggleLanguage: () => {
        const next = get().language === 'en' ? 'he' : 'en';
        get().setLanguage(next);
    },
}), {
    name: 'birthday-song-ui',
    onRehydrateStorage: () => (state) => {
        if (state) {
            applyTheme(state.theme);
            applyLanguage(state.language);
        }
    },
}));
