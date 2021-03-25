import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';

i18n.use(initReactI18next).init({
  resources: {
    en,
    fi,
    sv,
  },
  fallbackLng: 'fi',
  lng: 'fi',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
