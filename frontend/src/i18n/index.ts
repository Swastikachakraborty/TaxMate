import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import ta from "./locales/ta.json";

export const LANGUAGES = [
  { code: "en", name: "English",   nativeName: "English" },
  { code: "hi", name: "Hindi",     nativeName: "हिंदी" },
  { code: "ta", name: "Tamil",     nativeName: "தமிழ்" },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
    },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "gs_language",
      cacheUserLanguage: true,
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
