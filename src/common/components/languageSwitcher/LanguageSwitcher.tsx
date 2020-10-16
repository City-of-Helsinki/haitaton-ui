import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'fi', label: 'Suomi' },
  { code: 'sv', label: 'Svenska' },
  { code: 'en', label: 'English' },
];

const filterLanguages = (i18n: typeof i18next) =>
  languages.filter((lang) =>
    i18n.languages[0].length > 2
      ? i18n.languages[0].substr(0, 2) !== lang.code
      : i18n.languages[0] !== lang.code
  );

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const setLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <ul>
      {filterLanguages(i18n).map((lang) => (
        <li key={lang.code}>
          <button type="button" lang={lang.code} onClick={() => setLanguage(lang.code)}>
            {lang.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default LanguageSwitcher;
