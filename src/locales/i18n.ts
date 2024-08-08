import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';
import { BannerType, fetchBanners } from './banners';

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

export const loadBanners = async () => {
  try {
    const banners = await fetchBanners();

    if (banners[BannerType.INFO]) {
      const { label, text } = banners[BannerType.INFO];
      i18n.addResources('fi', 'serviceInfo', { label: label.fi, text: text.fi });
      i18n.addResources('sv', 'serviceInfo', { label: label.sv, text: text.sv });
      i18n.addResources('en', 'serviceInfo', { label: label.en, text: text.en });
    }

    if (banners[BannerType.WARNING]) {
      const { label, text } = banners[BannerType.WARNING];
      i18n.addResources('fi', 'serviceWarning', { label: label.fi, text: text.fi });
      i18n.addResources('sv', 'serviceWarning', { label: label.sv, text: text.sv });
      i18n.addResources('en', 'serviceWarning', { label: label.en, text: text.en });
    }

    if (banners[BannerType.ERROR]) {
      const { label, text } = banners[BannerType.ERROR];
      i18n.addResources('fi', 'serviceError', { label: label.fi, text: text.fi });
      i18n.addResources('sv', 'serviceError', { label: label.sv, text: text.sv });
      i18n.addResources('en', 'serviceError', { label: label.en, text: text.en });
    }
  } catch (error) {
    console.error('Failed to load banner resources:', error);
  }
};

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
