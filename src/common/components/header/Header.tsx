import React from 'react';
import { IconLinkExternal, IconSignout, LogoLanguage, Navigation } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useMatch, useLocation, useNavigate } from 'react-router-dom';
import { $enum } from 'ts-enum-util';
import { getMatchingRouteKey, useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';
import authService from '../../../domain/auth/authService';
import useUser from '../../../domain/auth/useUser';
import { Language, LANGUAGES } from '../../types/language';
import { SKIP_TO_ELEMENT_ID } from '../../constants/constants';
import { useFeatureFlags } from '../featureFlags/FeatureFlagsContext';

const languageLabels = {
  fi: 'Suomi',
  en: 'English',
  sv: 'Svenska',
};

const Header: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { HOME, PUBLIC_HANKKEET, PUBLIC_HANKKEET_MAP, HANKEPORTFOLIO, NEW_HANKE } =
    useLocalizedRoutes();
  const { t, i18n } = useTranslation();
  const { data: user } = useUser();
  const isAuthenticated = Boolean(user?.profile);
  const features = useFeatureFlags();

  const isMapPath = useMatch({
    path: PUBLIC_HANKKEET.path,
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

  const location = useLocation();
  const navigate = useNavigate();

  async function setLanguage(lang: Language) {
    const routeKey = getMatchingRouteKey(i18n, i18n.language as Language, location.pathname);
    await i18n.changeLanguage(lang);
    const to = lang + t(`routes:${routeKey}.path`);
    navigate(to);
  }

  return (
    <Navigation
      menuToggleAriaLabel={t('common:ariaLabels:menuToggle')}
      title="Haitaton"
      skipTo={`#${SKIP_TO_ELEMENT_ID}`}
      skipToContentLabel={t('common:components:header:skipToContentLabel')}
      titleUrl={HOME.path}
      className="header"
      logoLanguage={i18n.language as LogoLanguage}
    >
      {isAuthenticated && (
        <Navigation.Row ariaLabel={t('common:ariaLabels:topNavigation')}>
          {features.publicHankkeet ? (
            <Navigation.Item as={NavLink} to={PUBLIC_HANKKEET_MAP.path} active={Boolean(isMapPath)}>
              {PUBLIC_HANKKEET.label}
            </Navigation.Item>
          ) : (
            <></>
          )}
          {features.hanke ? (
            <Navigation.Item
              as={NavLink}
              to={NEW_HANKE.path}
              active={Boolean(isNewHankePath)}
              data-testid="hankeLink"
            >
              {NEW_HANKE.label}
            </Navigation.Item>
          ) : (
            <></>
          )}
          <Navigation.Item
            as={NavLink}
            to={HANKEPORTFOLIO.path}
            active={Boolean(isHankePortfolioPath)}
            data-testid="hankeListLink"
          >
            {HANKEPORTFOLIO.label}
          </Navigation.Item>
          <Navigation.Item
            href={t('routes:WORKINSTRUCTIONS:path')}
            target="_blank"
            rel="noreferrer"
            icon={<IconLinkExternal />}
          >
            {t('routes:WORKINSTRUCTIONS:headerLabel')}
          </Navigation.Item>
        </Navigation.Row>
      )}
      <Navigation.Actions>
        <Navigation.User
          authenticated={isAuthenticated}
          onSignIn={authService.login}
          label={t('authentication:loginButton')}
          userName={user?.profile?.name}
          buttonAriaLabel={t('common:ariaLabels:profileButton')}
        >
          <Navigation.Item
            href=""
            icon={<IconSignout aria-hidden />}
            label={t('authentication:logoutButton')}
            variant="supplementary"
            onClick={async (e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              await authService.logout();
            }}
            data-testid="logoutLink"
          />
        </Navigation.User>
        <Navigation.LanguageSelector label={languageLabels[i18n.language as LANGUAGES]}>
          {$enum(LANGUAGES).map((lang) => (
            <Navigation.Item
              as="a"
              href=""
              label={languageLabels[lang]}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setLanguage(lang);
              }}
              key={lang}
              lang={lang}
            />
          ))}
        </Navigation.LanguageSelector>
      </Navigation.Actions>
    </Navigation>
  );
};

export default Header;
