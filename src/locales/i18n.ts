import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en,
      fi,
      sv,
    },
    detection: {
      order: ['localStorage', 'sessionStorage', 'path'],
    },
    fallbackLng: 'fi',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
