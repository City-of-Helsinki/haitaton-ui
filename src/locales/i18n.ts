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
      order: ['path', 'localStorage', 'sessionStorage'],
      excludeCacheFor: ['login'],
    },
    fallbackLng: 'fi',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

document.documentElement.lang = i18n.language;

i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
});

const warningLabel = window._env_.REACT_APP_WARNING_NOTIFICATION_LABEL;
const warningTextFI = window._env_.REACT_APP_WARNING_NOTIFICATION_TEXT_FI;
const warningTextSV = window._env_.REACT_APP_WARNING_NOTIFICATION_TEXT_SV;
const warningTextEN = window._env_.REACT_APP_WARNING_NOTIFICATION_TEXT_EN;

i18n.addResources('fi', 'serviceWarning', {
  label: warningLabel,
  text: warningTextFI,
});

if (warningLabel && warningTextSV) {
  i18n.addResources('sv', 'serviceWarning', {
    label: warningLabel,
    text: warningTextSV,
  });
}

if (warningLabel && warningTextEN) {
  i18n.addResources('en', 'serviceWarning', {
    label: warningLabel,
    text: warningTextEN,
  });
}

const errorLabel = window._env_.REACT_APP_ERROR_NOTIFICATION_LABEL;
const errorTextFI = window._env_.REACT_APP_ERROR_NOTIFICATION_TEXT_FI;
const errorTextSV = window._env_.REACT_APP_ERROR_NOTIFICATION_TEXT_SV;
const errorTextEN = window._env_.REACT_APP_ERROR_NOTIFICATION_TEXT_EN;

i18n.addResources('fi', 'serviceError', {
  label: errorLabel,
  text: errorTextFI,
});

if (errorLabel && errorTextSV) {
  i18n.addResources('sv', 'serviceError', {
    label: errorLabel,
    text: errorTextSV,
  });
}

if (errorLabel && errorTextEN) {
  i18n.addResources('en', 'serviceError', {
    label: errorLabel,
    text: errorTextEN,
  });
}

export default i18n;
