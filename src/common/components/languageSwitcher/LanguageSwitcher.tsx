import React, { useState } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import './styles.scss';

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
  const [isopen, setIsopen] = useState(false);
  return (
    <div className="lang">
      <button type="button" className="lang__open" onClick={() => setIsopen(!isopen)}>
        {i18n.language}
        <i aria-hidden="true" className="hds-icon hds-icon--angle-down" />
      </button>
      {isopen && (
        <ul className="lang__listWpr">
          {filterLanguages(i18n).map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                lang={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsopen(!isopen);
                }}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
