import React from 'react';
import { IconSignout, Navigation } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useMatch } from 'react-router-dom';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';
import authService from '../../../domain/auth/authService';
import useUser from '../../../domain/auth/useUser';

const Header: React.FC = () => {
  const { HOME, MAP, HANKEPORTFOLIO, NEW_HANKE } = useLocalizedRoutes();
  const { t } = useTranslation();
  const { data: user } = useUser();

  const isMapPath = useMatch({
    path: MAP.path,
    end: false,
  });
  const isNewHankePath = useMatch({
    path: NEW_HANKE.path,
    end: false,
  });
  const isHankePortfolioPath = useMatch({
    path: HANKEPORTFOLIO.path,
    end: false,
  });

  return (
    <Navigation
      menuToggleAriaLabel={t('common:components:multiselect:toggle')}
      title="Haitaton Beta"
      skipTo="#"
      skipToContentLabel={t('common:components:header:skipToContentLabel')}
      titleUrl={HOME.path}
      className="header"
    >
      <Navigation.Row>
        <Navigation.Item as={NavLink} to={MAP.path} active={Boolean(isMapPath)}>
          {MAP.label}
        </Navigation.Item>
        <Navigation.Item
          as={NavLink}
          to={NEW_HANKE.path}
          active={Boolean(isNewHankePath)}
          data-testid="hankeLink"
        >
          {NEW_HANKE.label}
        </Navigation.Item>
        <Navigation.Item
          as={NavLink}
          to={HANKEPORTFOLIO.path}
          active={Boolean(isHankePortfolioPath)}
          data-testid="hankeListLink"
        >
          {HANKEPORTFOLIO.label}
        </Navigation.Item>
        <Navigation.Item href={t('routes:WORKINSTRUCTIONS:path')} target="_blank" rel="noreferrer">
          {t('routes:WORKINSTRUCTIONS:headerLabel')}
        </Navigation.Item>
      </Navigation.Row>
      <Navigation.Actions>
        <Navigation.User
          authenticated={Boolean(user?.profile)}
          onSignIn={authService.login}
          label={t('authentication:loginButton')}
          userName={user?.profile?.name}
        >
          <Navigation.Item
            icon={<IconSignout aria-hidden />}
            label={t('authentication:logoutButton')}
            variant="supplementary"
            onClick={authService.logout}
            data-testid="logoutLink"
          />
        </Navigation.User>
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
