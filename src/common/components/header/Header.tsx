import React, { useState } from 'react';
import { Navigation } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Locale from '../locale/Locale';
import './Header.styles.scss';

const languages = [
  { code: 'fi', label: 'Suomi' },
  { code: 'sv', label: 'Svenska' },
  { code: 'en', label: 'English' },
];
type Types = {
  code: string;
  label: string;
};

const Header: React.FC = () => {
  const [language, setLanguageState] = useState<Types>(languages[0]);

  const { i18n } = useTranslation();
  const setLanguage = (code: Types) => {
    setLanguageState(code);
    i18n.changeLanguage(code.code);
  };
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
        <NavLink to={`/${language.code}${ROUTES.HOME}`} exact activeClassName="header--active">
          <Locale id="header:home" />
        </NavLink>
        <NavLink to={`/${language.code}${ROUTES.MAP}`} activeClassName="header--active">
          <Locale id="header:map" />
        </NavLink>
        <NavLink to={`/${language.code}${ROUTES.PROJECTS}`} activeClassName="header--active">
          <Locale id="header:projects" />
        </NavLink>
        <NavLink to={`/${language.code}${ROUTES.FORM}`} activeClassName="header--active">
          <Locale id="header:form" />
        </NavLink>
      </Navigation.Row>
      <Navigation.LanguageSelector
        options={languages}
        onLanguageChange={setLanguage}
        value={language}
      />
    </Navigation>
  );
};

export default Header;
