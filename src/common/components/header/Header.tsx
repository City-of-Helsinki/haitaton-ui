import React, { useState } from 'react';
import { Navigation } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';
import authService from '../../../domain/auth/authService';
import Locale from '../locale/Locale';
import './Header.styles.scss';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { HOME, MAP, PROJECTS, NEW_HANKE, EDIT_HANKE } = useLocalizedRoutes();
  const { t } = useTranslation();
  const isAuthenticated = authService.isAuthenticated();

  const isHankeEdit = useRouteMatch({
    path: EDIT_HANKE.path,
    strict: true,
  });

  return (
    <Navigation
      menuToggleAriaLabel="Open and close menu"
      menuOpen={menuOpen}
      onMenuToggle={() => setMenuOpen(!menuOpen)}
      title="Haitaton Beta"
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
        {/* 
          Hankelomake menee sekaisin jos sille unmounttia ei tapahdu
          Sen takia piilotetaan "Luo hanke" -nappi silloin kun hankkeen muokkaus on auki
        */}
        {!isHankeEdit ? (
          <NavLink to={NEW_HANKE.path} className="header__hankeLink" data-testid="hankeLink">
            <Locale id="header:hankeLink" />
          </NavLink>
        ) : (
          <span />
        )}
      </Navigation.Row>
      <Navigation.Actions>
        <Navigation.Item>
          {isAuthenticated ? (
            <NavLink
              to="/logout"
              activeClassName="header--active"
              data-testid="logoutLink"
              onClick={(e) => {
                e.preventDefault();
                authService.logout();
              }}
            >
              {t('authentication:logoutButton')}
            </NavLink>
          ) : (
            <NavLink to="/login" activeClassName="header--active" data-testid="loginLink">
              {t('authentication:loginButton')}
            </NavLink>
          )}
        </Navigation.Item>
      </Navigation.Actions>
      {/*
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
          </Navigation.LanguageSelector> */}
    </Navigation>
  );
};

export default Header;
