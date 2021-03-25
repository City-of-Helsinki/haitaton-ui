import { useTranslation } from 'react-i18next';
import { Language } from '../types/language';

export default (): Language => {
  const {
    i18n: { language },
  } = useTranslation();

  switch (language) {
    case 'en':
    case 'fi':
    case 'sv':
      return language;
    default:
      return 'fi';
  }
};
