import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import he from './he.json';
const savedLang = (() => {
    try {
        const stored = localStorage.getItem('birthday-song-ui');
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed?.state?.language || 'he';
        }
    }
    catch {
        // Ignore parse errors
    }
    return 'he';
})();
i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        he: { translation: he },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
export default i18n;
