import { useState } from 'react';
import { IconSignout, Header, IconUser, Link, Logo, logoFi, logoSv, Button } from 'hds-react';
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
import authService from '../../../domain/auth/authService';
import useUser from '../../../domain/auth/useUser';
import { Language, LANGUAGES } from '../../types/language';
import { SKIP_TO_ELEMENT_ID } from '../../constants/constants';
import { useFeatureFlags } from '../featureFlags/FeatureFlagsContext';
import HankeCreateDialog from '../../../domain/hanke/hankeCreateDialog/HankeCreateDialog';
import JohtoselvitysCreateDialog from '../../../domain/johtoselvitys_new/johtoselvitysCreateDialog/JohtoselvitysCreateDialog';

const languageLabels = {
  fi: 'Suomi',
  en: 'English',
  sv: 'Svenska',
};

function HaitatonHeader() {
  const { HOME, PUBLIC_HANKKEET, PUBLIC_HANKKEET_MAP, HANKEPORTFOLIO, JOHTOSELVITYSHAKEMUS } =
    useLocalizedRoutes();
  const { t, i18n } = useTranslation();
  const { data: user } = useUser();
  const isAuthenticated = Boolean(user?.profile);
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

  const workInstructionsAriaLabel = `${t('routes:WORKINSTRUCTIONS:headerLabel')}. ${t(
    'common:components:link:openInNewTabAriaLabel',
  )} ${t('common:components:link:openInExternalDomainAriaLabel')}`;

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
    if (isAuthenticated) {
      return user?.profile.name ?? (user?.profile.email as string);
    }
    return t('authentication:loginButton');
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
        <Header.ActionBarItem
          label={getUserMenuLabel()}
          fixedRightPosition
          preventButtonResize
          icon={<IconUser aria-hidden />}
          id="action-bar-login"
          closeLabel={t('common:ariaLabels:closeButtonLabelText')}
          onClick={!isAuthenticated ? authService.login : undefined}
        >
          {isAuthenticated && (
            <Button
              variant="supplementary"
              iconLeft={<IconSignout aria-hidden />}
              onClick={authService.logout}
            >
              {t('authentication:logoutButton')}
            </Button>
          )}
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
      <HankeCreateDialog isOpen={showHankeCreateDialog} onClose={closeHankeCreateDialog} />
      <JohtoselvitysCreateDialog
        isOpen={showJohtoselvitysCreateDialog}
        onClose={closeJohtoselvitysCreateDialog}
      />
    </Header>
  );
}

export default HaitatonHeader;
