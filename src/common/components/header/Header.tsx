import { useState } from 'react';
import { Header, IconUser, Logo, logoFi, logoSv } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useMatch, useLocation, useNavigate } from 'react-router-dom';
import { $enum } from 'ts-enum-util';
import {
  getMatchingRouteKey,
  useLocalizedRoutes,
  HANKETUNNUS_REGEXP,
  APPLICATION_ID_REGEXP,
  USER_ID_REGEXP,
} from '../../hooks/useLocalizedRoutes';
import useUser from '../../../domain/auth/useUser';
import { Language, LANGUAGES } from '../../types/language';
import { SKIP_TO_ELEMENT_ID } from '../../constants/constants';
import { useFeatureFlags } from '../featureFlags/FeatureFlagsContext';
import HankeCreateDialog from '../../../domain/hanke/hankeCreateDialog/HankeCreateDialog';
import JohtoselvitysCreateDialog from '../../../domain/johtoselvitys/johtoselvitysCreateDialog/JohtoselvitysCreateDialog';
import useIsAuthenticated from '../../../domain/auth/useIsAuthenticated';

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
    JOHTOSELVITYSHAKEMUS,
    WORKINSTRUCTIONS,
  } = useLocalizedRoutes();
  const { t, i18n } = useTranslation();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const features = useFeatureFlags();
  const logoSrc = i18n.language === 'sv' ? logoSv : logoFi;
  const [showHankeCreateDialog, setShowHankeCreateDialog] = useState(false);
  const [showJohtoselvitysCreateDialog, setShowJohtoselvitysCreateDialog] = useState(false);

  const isMapPath = useMatch({
    path: PUBLIC_HANKKEET.path,
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
  const isWorkInstructionsPath = useMatch({
    path: WORKINSTRUCTIONS.path,
    end: false,
  });

  const location = useLocation();
  const navigate = useNavigate();

  function getPathForLanguage(lang: Language, routeKey: string): string {
    const hankeTunnusMatches = HANKETUNNUS_REGEXP.exec(location.pathname);
    const hankeTunnus = hankeTunnusMatches?.[0];
    const applicationIdMatches = APPLICATION_ID_REGEXP.exec(location.pathname);
    const applicationId = applicationIdMatches?.[0];
    const userIdMatches = USER_ID_REGEXP.exec(location.pathname);
    const userId = userIdMatches?.[0];

    let path = lang + t(`routes:${routeKey}.path`);
    if (hankeTunnus) {
      path = path.replace(':hankeTunnus', hankeTunnus);
    }
    if (userId) {
      path = path.replace(':id', userId);
    }
    if (applicationId) {
      path = path.replace(':id', applicationId);
    }
    return path;
  }

  async function setLanguage(lang: string) {
    const routeKey = getMatchingRouteKey(i18n, i18n.language as Language, location.pathname);
    await i18n.changeLanguage(lang);
    const path = getPathForLanguage(lang as Language, routeKey);
    navigate(path);
  }

  function getUserMenuLabel() {
    return user?.profile.name ?? (user?.profile.email as string);
  }

  function openHankeCreateDialog() {
    setShowHankeCreateDialog(true);
  }

  function closeHankeCreateDialog() {
    setShowHankeCreateDialog(false);
  }

  function openJohtoselvitysCreateDialog() {
    setShowJohtoselvitysCreateDialog(true);
  }

  function closeJohtoselvitysCreateDialog() {
    setShowJohtoselvitysCreateDialog(false);
  }

  return (
    <Header
      languages={$enum(LANGUAGES).map((lang) => ({
        label: languageLabels[lang],
        value: lang,
        isPrimary: true,
      }))}
      onDidChangeLanguage={setLanguage}
      defaultLanguage={i18n.language}
    >
      <Header.SkipLink
        skipTo={`#${SKIP_TO_ELEMENT_ID}`}
        label={t('common:components:header:skipToContentLabel')}
      />
      <Header.ActionBar
        title="Haitaton"
        titleHref={HOME.path}
        logoHref={HOME.path}
        frontPageLabel={t('common:components:header:frontPageLabel')}
        logo={<Logo src={logoSrc} alt={t('common:logoAlt')} />}
        menuButtonAriaLabel={t('common:ariaLabels:menuToggle')}
      >
        <Header.LanguageSelector />
        {isAuthenticated && (
          <Header.ActionBarItem
            label={getUserMenuLabel()}
            fixedRightPosition
            preventButtonResize
            icon={<IconUser />}
            id="action-bar-user-menu"
            closeLabel={t('common:ariaLabels:closeButtonLabelText')}
          >
            <Header.LogoutSubmenuButton
              id="log-out-button"
              label={t('authentication:logoutButton')}
              errorLabel={t('authentication:logoutError')}
              errorText={t('authentication:logoutError')}
              errorCloseAriaLabel={t('common:ariaLabels:closeButtonLabelText')}
              loggingOutText={t('authentication:loggingOut')}
            />
          </Header.ActionBarItem>
        )}
        <Header.LoginButton
          id="login-button"
          label={t('authentication:loginButton')}
          errorLabel={t('authentication:loggingInErrorLabel')}
          errorText={t('authentication:genericError')}
          errorCloseAriaLabel={t('common:ariaLabels:closeButtonLabelText')}
          loggingInText={t('authentication:loggingIn')}
          redirectionProps={{ language: i18n.language }}
          fixedRightPosition
        />
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
              label={t('homepage:hanke:title')}
              as={NavLink}
              to="#"
              onClick={openHankeCreateDialog}
              data-testid="hankeLink"
            />
          )}
          <Header.Link
            label={t('homepage:johtotietoselvitys:title')}
            as={NavLink}
            to="#"
            onClick={openJohtoselvitysCreateDialog}
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
            as={NavLink}
            to={WORKINSTRUCTIONS.path}
            aria-label={t('routes:workInstructionsAriaLabel')}
            active={Boolean(isWorkInstructionsPath)}
          >
            {t('routes:WORKINSTRUCTIONS:headerLabel')}
          </Header.Link>
        </Header.NavigationMenu>
      )}
      <HankeCreateDialog isOpen={showHankeCreateDialog} onClose={closeHankeCreateDialog} />
      <JohtoselvitysCreateDialog
        isOpen={showJohtoselvitysCreateDialog}
        onClose={closeJohtoselvitysCreateDialog}
      />
    </Header>
  );
}

export default HaitatonHeader;
