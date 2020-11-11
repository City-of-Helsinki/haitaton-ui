import React, { useState, useEffect } from 'react';
import { Navigation } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { registerLocale } from 'react-datepicker';
import fi from 'date-fns/locale/fi';
import sv from 'date-fns/locale/sv';
import en from 'date-fns/locale/en-GB';

import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';
import Locale from '../locale/Locale';

import './Header.styles.scss';

const languages = [
  { code: 'fi', label: 'Suomi', dateFns: fi },
  { code: 'sv', label: 'Svenska', dateFns: sv },
  { code: 'en', label: 'English', dateFns: en },
];
type Types =
  | {
      code: string;
      label: string;
      // eslint-disable-next-line
      dateFns: any;
    }
  | undefined;

const Header: React.FC = () => {
  const [language, setLanguageState] = useState<Types>(languages[0]);
  const { HOME, MAP, PROJECTS, FORM } = useLocalizedRoutes();

  const { i18n } = useTranslation();

  const setLanguage = (code: Types) => {
    if (!code) return;
    registerLocale(code.dateFns.code, code.dateFns);
    setLanguageState(code);
    i18n.changeLanguage(code.code);
  };
  useEffect(() => {
    const langObj = languages.find((item) => item.code === i18n.language);
    setLanguage(langObj);
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Navigation
      menuCloseAriaLabel="Close menu"
      menuOpenAriaLabel="Open menu"
      menuOpen={menuOpen}
      onMenuToggle={() => setMenuOpen(!menuOpen)}
      title="Haitaton 2.0"
      skipTo="#"
      skipToContentLabel="Skip to main content"
      titleUrl="/"
      className="header"
    >
      <Navigation.Row display="inline">
        <NavLink to={HOME.path} exact activeClassName="header--active" data-testid="homeLink">
          {HOME.label}
        </NavLink>
        <NavLink to={MAP.path} activeClassName="header__active">
          {MAP.label}
        </NavLink>
        <NavLink to={PROJECTS.path} activeClassName="header__active">
          {PROJECTS.label}
        </NavLink>
        <NavLink to={FORM.path} activeClassName="header__active">
          {FORM.label}
        </NavLink>
      </Navigation.Row>
      <div className="header__hankeLink">
        <NavLink data-testid="hankeLink" to={FORM.path} activeClassName="header__active">
          <Locale id="header:hankeLink" />
        </NavLink>
      </div>
      <Navigation.LanguageSelector
        options={languages}
        onLanguageChange={setLanguage}
        value={language}
      />
    </Navigation>
  );
};

export default Header;
