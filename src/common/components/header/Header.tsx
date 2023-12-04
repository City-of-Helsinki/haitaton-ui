/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  IconLinkExternal,
  IconSignout,
  Header,
  IconUser,
  Link,
  Logo,
  logoFi,
  logoSv,
  IconEye,
  Button,
} from 'hds-react';
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

function HaitatonHeader() {
  const {
    HOME,
    PUBLIC_HANKKEET,
    PUBLIC_HANKKEET_MAP,
    HANKEPORTFOLIO,
    NEW_HANKE,
    JOHTOSELVITYSHAKEMUS,
  } = useLocalizedRoutes();
  const { t, i18n } = useTranslation();
  const { data: user } = useUser();
  const isAuthenticated = Boolean(user?.profile);
  const features = useFeatureFlags();
  const logoSrc = i18n.language === 'sv' ? logoSv : logoFi;

  const isMapPath = useMatch({
    path: PUBLIC_HANKKEET.path,
    end: false,
  });
  const isNewHankePath = useMatch({
    path: NEW_HANKE.path,
    end: false,
  });
  const isCableReportApplicationPath = useMatch({
    path: JOHTOSELVITYSHAKEMUS.path,
    end: true,
  });
  const isHankePortfolioPath = useMatch({
    path: HANKEPORTFOLIO.path,
    end: false,
  });

  const workInstructionsAriaLabel = `${t('routes:WORKINSTRUCTIONS:headerLabel')}. ${t(
    'common:components:link:openInNewTabAriaLabel',
  )} ${t('common:components:link:openInExternalDomainAriaLabel')}`;

  const location = useLocation();
  const navigate = useNavigate();

  async function setLanguage(lang: string) {
    const routeKey = getMatchingRouteKey(i18n, i18n.language as Language, location.pathname);
    await i18n.changeLanguage(lang);
    const to = lang + t(`routes:${routeKey}.path`);
    navigate(to);
  }

  function getUserMenuLabel() {
    if (isAuthenticated) {
      return user?.profile.name || user?.profile.email;
    }
    return t('authentication:loginButton');
  }

  return (
    <Header
      languages={$enum(LANGUAGES).map((lang) => ({
        label: languageLabels[lang],
        value: lang,
        isPrimary: true,
      }))}
      onDidChangeLanguage={setLanguage}
    >
      <Header.SkipLink
        skipTo={`#${SKIP_TO_ELEMENT_ID}`}
        label={t('common:components:header:skipToContentLabel')}
      />
      {/* // <Navigation
    //   menuToggleAriaLabel={t('common:ariaLabels:menuToggle')}
    //   className="header"
    //   logoLanguage={i18n.language as LogoLanguage}
    // > */}

      <Header.ActionBar
        title="Haitaton"
        titleHref={HOME.path}
        logoHref={HOME.path}
        frontPageLabel="Haitaton"
        logo={<Logo src={logoSrc} alt="Helsingin kaupunki" />}
      >
        <Header.LanguageSelector />
        <Header.ActionBarItem
          label={getUserMenuLabel()}
          fixedRightPosition
          icon={<IconUser />}
          id="action-bar-login"
          closeLabel={t('common:ariaLabels:closeButtonLabelText')}
          onClick={!isAuthenticated ? authService.login : undefined}
        >
          <Button
            variant="supplementary"
            iconLeft={<IconSignout aria-hidden />}
            onClick={authService.logout}
          >
            {t('authentication:logoutButton')}
          </Button>
        </Header.ActionBarItem>
      </Header.ActionBar>

      {isAuthenticated && (
        <Header.NavigationMenu>
          {features.publicHankkeet && (
            <Header.Link
              label={PUBLIC_HANKKEET.label}
              as={NavLink}
              to={PUBLIC_HANKKEET_MAP.path}
              active={Boolean(isMapPath)}
            />
          )}
          {features.hanke && (
            <Header.Link
              label={NEW_HANKE.label}
              as={NavLink}
              to={NEW_HANKE.path}
              active={Boolean(isNewHankePath)}
              data-testid="hankeLink"
            />
          )}
          <Header.Link
            label={t('homepage:johtotietoselvitys:title')}
            as={NavLink}
            to={JOHTOSELVITYSHAKEMUS.path}
            active={Boolean(isCableReportApplicationPath)}
            data-testid="cableReportApplicationLink"
          />
          <Header.Link
            label={HANKEPORTFOLIO.label}
            as={NavLink}
            to={HANKEPORTFOLIO.path}
            active={Boolean(isHankePortfolioPath)}
            data-testid="hankeListLink"
          />
          <Header.Link
            label={t('routes:WORKINSTRUCTIONS:headerLabel')}
            as={Link}
            href={t('routes:WORKINSTRUCTIONS:path')}
            external
            openInNewTab
            aria-label={workInstructionsAriaLabel}
          >
            {t('routes:WORKINSTRUCTIONS:headerLabel')}
          </Header.Link>
        </Header.NavigationMenu>
      )}
    </Header>
  );
}

export default HaitatonHeader;

// <Navigation.Actions>
//   <Navigation.User
//     authenticated={isAuthenticated}
//     onSignIn={authService.login}
//     label={t('authentication:loginButton')}
//     userName={user?.profile?.name}
//     buttonAriaLabel={t('common:ariaLabels:profileButton')}
//   >
//     <Navigation.Item
//       href=""
//       icon={<IconSignout aria-hidden />}
//       label={t('authentication:logoutButton')}
//       variant="supplementary"
//       onClick={async (e: React.MouseEvent<HTMLAnchorElement>) => {
//         e.preventDefault();
//         await authService.logout();
//       }}
//       data-testid="logoutLink"
//     />
//   </Navigation.User>
//   <Navigation.LanguageSelector label={languageLabels[i18n.language as LANGUAGES]}>
//     {$enum(LANGUAGES).map((lang) => (
//       <Navigation.Item
//         as="a"
//         href=""
//         label={languageLabels[lang]}
//         onClick={(e: React.MouseEvent) => {
//           e.preventDefault();
//           setLanguage(lang);
//         }}
//         key={lang}
//         lang={lang}
//       />
//     ))}
//   </Navigation.LanguageSelector>
// </Navigation.Actions>
