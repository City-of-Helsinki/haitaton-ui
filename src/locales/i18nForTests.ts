import i18next from 'i18next';
import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';

const instance = i18next.createInstance();

instance.init({
  resources: {
    en,
    fi,
    sv,
  },
  fallbackLng: 'fi',
  lng: 'fi',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default instance;

const t = i18next.t.bind(instance);
export { t };
