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
    supportedLngs: ['fi', 'sv', 'en'],
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

const infoLabelFI = window._env_.REACT_APP_INFO_NOTIFICATION_LABEL;
const infoLabelSV = window._env_.REACT_APP_INFO_NOTIFICATION_LABEL_SV;
const infoLabelEN = window._env_.REACT_APP_INFO_NOTIFICATION_LABEL_EN;
const infoTextFI = window._env_.REACT_APP_INFO_NOTIFICATION_TEXT_FI;
const infoTextSV = window._env_.REACT_APP_INFO_NOTIFICATION_TEXT_SV;
const infoTextEN = window._env_.REACT_APP_INFO_NOTIFICATION_TEXT_EN;

i18n.addResources('fi', 'serviceInfo', {
  label: infoLabelFI,
  text: infoTextFI,
});

if (infoLabelSV && infoTextSV) {
  i18n.addResources('sv', 'serviceInfo', {
    label: infoLabelSV,
    text: infoTextSV,
  });
}

if (infoLabelEN && infoTextEN) {
  i18n.addResources('en', 'serviceInfo', {
    label: infoLabelEN,
    text: infoTextEN,
  });
}

const warningLabelFI = window._env_.REACT_APP_WARNING_NOTIFICATION_LABEL;
const warningLabelSV = window._env_.REACT_APP_WARNING_NOTIFICATION_LABEL_SV;
const warningLabelEN = window._env_.REACT_APP_WARNING_NOTIFICATION_LABEL_EN;
const warningTextFI = window._env_.REACT_APP_WARNING_NOTIFICATION_TEXT_FI;
const warningTextSV = window._env_.REACT_APP_WARNING_NOTIFICATION_TEXT_SV;
const warningTextEN = window._env_.REACT_APP_WARNING_NOTIFICATION_TEXT_EN;

i18n.addResources('fi', 'serviceWarning', {
  label: warningLabelFI,
  text: warningTextFI,
});

if (warningLabelSV && warningTextSV) {
  i18n.addResources('sv', 'serviceWarning', {
    label: warningLabelSV,
    text: warningTextSV,
  });
}

if (warningLabelEN && warningTextEN) {
  i18n.addResources('en', 'serviceWarning', {
    label: warningLabelEN,
    text: warningTextEN,
  });
}

const errorLabelFI = window._env_.REACT_APP_ERROR_NOTIFICATION_LABEL;
const errorLabelSV = window._env_.REACT_APP_ERROR_NOTIFICATION_LABEL_SV;
const errorLabelEN = window._env_.REACT_APP_ERROR_NOTIFICATION_LABEL_EN;
const errorTextFI = window._env_.REACT_APP_ERROR_NOTIFICATION_TEXT_FI;
const errorTextSV = window._env_.REACT_APP_ERROR_NOTIFICATION_TEXT_SV;
const errorTextEN = window._env_.REACT_APP_ERROR_NOTIFICATION_TEXT_EN;

i18n.addResources('fi', 'serviceError', {
  label: errorLabelFI,
  text: errorTextFI,
});

if (errorLabelSV && errorTextSV) {
  i18n.addResources('sv', 'serviceError', {
    label: errorLabelSV,
    text: errorTextSV,
  });
}

if (errorLabelEN && errorTextEN) {
  i18n.addResources('en', 'serviceError', {
    label: errorLabelEN,
    text: errorTextEN,
  });
}

const maintenanceTextFI = window._env_.REACT_APP_MAINTENANCE_TEXT_FI;
const maintenanceTextSV = window._env_.REACT_APP_MAINTENANCE_TEXT_SV;
const maintenanceTextEN = window._env_.REACT_APP_MAINTENANCE_TEXT_EN;

i18n.addResources('fi', 'serviceMaintenance', {
  text: maintenanceTextFI,
});

i18n.addResources('sv', 'serviceMaintenance', {
  text: maintenanceTextSV,
});

i18n.addResources('en', 'serviceMaintenance', {
  text: maintenanceTextEN,
});

export default i18n;
