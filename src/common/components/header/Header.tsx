import React, { useState } from 'react';
import { Navigation } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { $enum } from 'ts-enum-util';
import { LANGUAGES, Language } from '../../types/language';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';
import Locale from '../locale/Locale';
import './Header.styles.scss';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { HOME, MAP, PROJECTS, FORM } = useLocalizedRoutes();
  const { i18n, t } = useTranslation();

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Navigation
      menuToggleAriaLabel="Open and close menu"
      menuOpen={menuOpen}
      onMenuToggle={() => setMenuOpen(!menuOpen)}
      title="Haitaton 2.0"
      skipTo="#"
      skipToContentLabel="Skip to main content"
      titleUrl={HOME.path}
      className="header"
    >
      <Navigation.Row variant="inline">
        <NavLink to={MAP.path} activeClassName="header--active">
          {MAP.label}
        </NavLink>
        <NavLink to={PROJECTS.path} activeClassName="header--active" data-testid="hankeListLink">
          {PROJECTS.label}
        </NavLink>
        <NavLink to={FORM.path} className="header__hankeLink" data-testid="hankeLink">
          <Locale id="header:hankeLink" />
        </NavLink>
      </Navigation.Row>

      <Navigation.LanguageSelector label={t(`common:languages:${i18n.language}`)}>
        {$enum(LANGUAGES).map((lang) => (
          <Navigation.Item
            as="a"
            href={`/${lang}`}
            label={t(`common:languages:${lang}`)}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              setLanguage(lang);
            }}
            key={lang}
          />
        ))}
      </Navigation.LanguageSelector>
    </Navigation>
  );
};

export default Header;
