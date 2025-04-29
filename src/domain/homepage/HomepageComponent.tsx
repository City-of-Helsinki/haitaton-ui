import React, { useState } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import {
  ButtonPresetTheme,
  ButtonVariant,
  Hero,
  Link,
  LoginButton,
  Notification,
  useOidcClient,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import styles from './Homepage.module.scss';
import img1 from './HKMS000005_km0000pi1k.webp';
import img2 from './HKMS000005_km0000pi1q.webp';
import img3 from './HKMS000005_km003yz2.webp';
import img4 from './kartta.png';
import kalasatama from './kalasatama.webp';
import Linkbox from '../../common/components/Linkbox/Linkbox';
import FeatureFlags from '../../common/components/featureFlags/FeatureFlags';
import {
  FeatureFlagsContextProps,
  useFeatureFlags,
} from '../../common/components/featureFlags/FeatureFlagsContext';
import HankeCreateDialog from '../hanke/hankeCreateDialog/HankeCreateDialog';
import JohtoselvitysCreateDialog from '../johtoselvitys/johtoselvitysCreateDialog/JohtoselvitysCreateDialog';
import useIsAuthenticated from '../auth/useIsAuthenticated';
import useLocale from '../../common/hooks/useLocale';
import { SKIP_TO_ELEMENT_ID } from '../../common/constants/constants';

const FEEDBACK_NOTIFICATION_CLOSED = 'feedback-notification-closed';

const Homepage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation();
  const { login } = useOidcClient();
  const { PUBLIC_HANKKEET, HANKEPORTFOLIO, WORKINSTRUCTIONS } = useLocalizedRoutes();
  const [feedbackOpen, setFeedbackOpen] = useState(
    !sessionStorage.getItem(FEEDBACK_NOTIFICATION_CLOSED),
  );
  const [showHankeCreateDialog, setShowHankeCreateDialog] = useState(false);
  const [showJohtoselvitysCreateDialog, setShowJohtoselvitysCreateDialog] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const features = useFeatureFlags();
  const locale = useLocale();

  const loggedInLinks = [
    {
      key: 'kartta',
      actionLink: PUBLIC_HANKKEET.path,
      imgProps: { src: img1, width: 384, height: 245 },
      external: false,
      featureFlags: ['publicHankkeet'],
    },
    {
      key: 'hanke',
      actionLink: undefined,
      imgProps: { src: img2, width: 384, height: 245 },
      external: false,
      featureFlags: ['hanke'],
    },
    {
      key: 'johtotietoselvitys',
      actionLink: undefined,
      imgProps: { src: img1, width: 384, height: 245 },
      external: false,
      featureFlags: [],
    },
    {
      key: 'hankesalkku',
      actionLink: HANKEPORTFOLIO.path,
      imgProps: { src: img3, width: 384, height: 245 },
      external: false,
      featureFlags: [],
    },
    {
      key: 'ohjeet',
      actionLink: features.hanke
        ? WORKINSTRUCTIONS.path
        : t('workInstructions:sideNav:externalLinks:permitsAndInstructions:url'),
      imgProps: undefined,
      external: !features.hanke,
      featureFlags: [],
    },
  ];

  const loggedOutLinks = [
    {
      key: 'kartta_kirjautumaton',
      actionLink: PUBLIC_HANKKEET.path,
      imgProps: { src: img4, width: 384, height: 245 },
      external: false,
      featureFlags: ['publicHankkeet'],
    },
    {
      key: 'ohjeet',
      actionLink: WORKINSTRUCTIONS.path,
      imgProps: undefined,
      external: false,
      featureFlags: ['hanke'],
    },
  ];

  let loginContainer = null;
  if (!isAuthenticated && !features.publicHankkeet) {
    loginContainer = (
      <div className={styles.loginContainer}>
        <img
          src={kalasatama}
          alt={t('homepage:loginContainer:imageAltText')}
          className={styles.loginImage}
          width="768"
          height="513"
        />
        <div className={styles.loginContent}>
          <Text tag="h3" styleAs="h2" weight="bold" spacingBottom="xs">
            {t('homepage:johtotietoselvitys:title')}
          </Text>
          <p className="text-lg" style={{ marginBottom: 'var(--spacing-2-xl)' }}>
            {t('homepage:loginContainer:description')}
          </p>
          <LoginButton
            variant={ButtonVariant.Secondary}
            theme={ButtonPresetTheme.Black}
            loggingInText={t('authentication:loggingIn')}
            errorText={t('authentication:loggingInErrorLabel')}
            spinnerColor="var(--color-coat-of-arms)"
            redirectionProps={{ language: locale }}
          >
            {t('homepage:loginContainer:button')}
          </LoginButton>
        </div>
      </div>
    );
  }

  const links = isAuthenticated ? loggedInLinks : loggedOutLinks;

  const pageTitle = isAuthenticated ? t('homepage:pageTitle_loggedIn') : t('homepage:pageTitle');

  const pageSubtitle = isAuthenticated
    ? t('homepage:pageSubTitle_loggedIn')
    : t('homepage:pageSubTitle');

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

  function handleLinkBoxClick(key: string) {
    if (key === 'hanke') {
      return openHankeCreateDialog;
    }
    if (key === 'johtotietoselvitys') {
      return openJohtoselvitysCreateDialog;
    }
    return undefined;
  }

  return (
    <div className={clsx({ [styles.bgWhite]: !isAuthenticated && !features.publicHankkeet })}>
      <Hero
        theme={{
          '--background-color': 'var(--color-summer)',
          '--koros-color': `${isAuthenticated ? 'var(--color-black-5' : 'var(--color-white'}`,
        }}
        variant="noImage"
        centeredContent
      >
        <Hero.Title id={SKIP_TO_ELEMENT_ID} tabIndex={-1} aria-live="polite">
          {pageTitle}
        </Hero.Title>
        <Hero.Text>{pageSubtitle}</Hero.Text>
      </Hero>

      {!isAuthenticated && features.publicHankkeet && (
        <Box
          pb="var(--spacing-xl)"
          pt="var(--spacing-3-xl)"
          backgroundColor="var(--color-white)"
          zIndex={-1}
        >
          <Container>
            <p>
              {t('homepage:info')}
              <Link href="#" onClick={() => login({ language: locale })}>
                {t('homepage:info_link')}
              </Link>
            </p>
          </Container>
        </Box>
      )}

      <Container>
        <article className={styles.container}>
          {isAuthenticated && feedbackOpen && (
            <div className={styles.feedbackInfo}>
              <Notification
                label={t('homepage:notification:heading')}
                type="info"
                notificationAriaLabel={t('common:components:notification:notification')}
                autoClose={false}
                dismissible
                closeButtonLabelText={`${t('common:components:notification:closeButtonLabelText')}`}
                onClose={() => {
                  setFeedbackOpen(false);
                  sessionStorage.setItem(FEEDBACK_NOTIFICATION_CLOSED, 'true');
                }}
              >
                <p>
                  {t('homepage:notification:text')}
                  <Link href="mailto:haitaton@hel.fi">haitaton@hel.fi</Link>
                </p>
              </Notification>
            </div>
          )}
          {loginContainer}

          <Grid
            templateColumns={`repeat(auto-fit, minmax(300px, ${
              isAuthenticated ? '1fr' : '400px'
            }))`}
            gap={15}
            justifyContent="center"
            alignItems="start"
          >
            {links.map((item) => {
              return (
                <FeatureFlags
                  flags={item.featureFlags as (keyof FeatureFlagsContextProps)[]}
                  key={item.key}
                >
                  <div className={styles.linkboxContainer}>
                    <Linkbox
                      linkboxAriaLabel={`${t('common:components:linkbox:linkbox')}: ${t(
                        `homepage:${item.key}:actionText`,
                      )}`}
                      linkAriaLabel={t(`homepage:${item.key}:actionText`)}
                      href={item.actionLink}
                      heading={t(`homepage:${item.key}:title`)}
                      text={t(`homepage:${item.key}:description`)}
                      imgProps={item.imgProps}
                      external={item.external}
                      openInNewTab={item.external}
                      onClick={handleLinkBoxClick(item.key)}
                    />
                  </div>
                </FeatureFlags>
              );
            })}
          </Grid>
        </article>

        <HankeCreateDialog isOpen={showHankeCreateDialog} onClose={closeHankeCreateDialog} />
        <JohtoselvitysCreateDialog
          isOpen={showJohtoselvitysCreateDialog}
          onClose={closeJohtoselvitysCreateDialog}
        />
      </Container>
    </div>
  );
};

export default Homepage;
