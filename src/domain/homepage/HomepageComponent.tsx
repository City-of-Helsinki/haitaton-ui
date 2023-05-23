import React, { useState } from 'react';
import { Grid } from '@chakra-ui/react';
import { Button, Koros, Link, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import styles from './Homepage.module.scss';
import img1 from './HKMS000005_km0000pi1k.webp';
// import img2 from './HKMS000005_km0000pi1q.webp';
import img3 from './HKMS000005_km003yz2.webp';
// import img4 from './kartta.png';
import kalasatama from './kalasatama.webp';
import Linkbox from '../../common/components/Linkbox/Linkbox';
import useUser from '../auth/useUser';
import { SKIP_TO_ELEMENT_ID } from '../../common/constants/constants';

const Homepage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    // PUBLIC_HANKKEET_MAP,
    // PUBLIC_HANKKEET_LIST,
    HANKEPORTFOLIO,
    // NEW_HANKE,
    JOHTOSELVITYSHAKEMUS,
  } = useLocalizedRoutes();
  const [feedbackOpen, setFeedbackOpen] = useState(true);
  const { data: user } = useUser();
  const isAuthenticated = Boolean(user?.profile);

  const loggedInLinks = [
    // {
    //   key: 'kartta',
    //   actionLink: PUBLIC_HANKKEET_MAP.path,
    //   imgProps: { src: img1, width: 384, height: 245 },
    //   external: false,
    // },
    // {
    //   key: 'hanke',
    //   actionLink: NEW_HANKE.path,
    //   imgProps: { src: img2, width: 384, height: 245 },
    //   external: false,
    // },
    {
      key: 'johtotietoselvitys',
      actionLink: JOHTOSELVITYSHAKEMUS.path,
      imgProps: { src: img1, width: 384, height: 245 },
      external: false,
    },
    {
      key: 'hankesalkku',
      actionLink: HANKEPORTFOLIO.path,
      imgProps: { src: img3, width: 384, height: 245 },
      external: false,
    },
    {
      key: 'ohjeet',
      actionLink: t('routes:WORKINSTRUCTIONS:path'),
      imgProps: undefined,
      external: true,
    },
  ];

  const loggedOutLinks: never[] = [
    // {
    //   key: 'kartta_kirjautumaton',
    //   actionLink: PUBLIC_HANKKEET_MAP.path,
    //   imgProps: { src: img4, width: 384, height: 245 },
    //   external: false,
    // },
    // {
    //   key: 'hankelista',
    //   actionLink: PUBLIC_HANKKEET_LIST.path,
    //   imgProps: { src: img1, width: 384, height: 245 },
    //   external: false,
    // },
  ];

  let loginContainer = null;
  if (!isAuthenticated) {
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
          <Button variant="secondary" theme="black" onClick={() => navigate('/login')}>
            {t('homepage:loginContainer:button')}
          </Button>
        </div>
      </div>
    );
  }

  const links = isAuthenticated ? loggedInLinks : loggedOutLinks;

  const pageTitle = isAuthenticated ? t('homepage:pageTitle_loggedIn') : t('homepage:pageTitle');

  const pageSubtitle = isAuthenticated
    ? t('homepage:pageSubTitle_loggedIn')
    : t('homepage:pageSubTitle');

  return (
    <div className={clsx({ [styles.bgWhite]: !isAuthenticated })}>
      <div className={styles.heroContainer}>
        <section className={styles.hero}>
          <Text
            tag="h1"
            styleAs="h1"
            spacing="s"
            weight="bold"
            id={SKIP_TO_ELEMENT_ID}
            tabIndex={-1}
          >
            {pageTitle}
          </Text>
          <Text tag="h2" styleAs="h3" spacing="s" weight="bold">
            {pageSubtitle}
          </Text>
        </section>
        <Koros type="basic" flipHorizontal className={styles.koros} />
      </div>

      {/* {!isAuthenticated && (
        <Box
          pb="var(--spacing-xl)"
          pt="var(--spacing-3-xl)"
          backgroundColor="var(--color-white)"
          zIndex={-1}
        >
          <Container>
            <p>
              {t('homepage:info')}
              <Link href="/login">{t('homepage:info_link')}</Link>
            </p>
          </Container>
        </Box>
      )} */}

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
                onClose={() => setFeedbackOpen(false)}
              >
                <p>
                  {t('homepage:notification:text')}
                  <Link href="mailto:haitaton@hel.fi">haitaton@hel.fi</Link>
                </p>
              </Notification>
            </div>
          )}

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
                <div className={styles.linkboxContainer} key={item.key}>
                  <Linkbox
                    linkboxAriaLabel={`${t('common:components:linkbox:linkbox')}: ${t(
                      `homepage:${item.key}:actionText`
                    )}`}
                    linkAriaLabel={t(`homepage:${item.key}:actionText`)}
                    href={item.actionLink}
                    heading={t(`homepage:${item.key}:title`)}
                    text={t(`homepage:${item.key}:description`)}
                    imgProps={item.imgProps}
                    external={item.external}
                    openInNewTab={item.external}
                  />
                </div>
              );
            })}
          </Grid>

          {loginContainer}
        </article>
      </Container>
    </div>
  );
};

export default Homepage;
