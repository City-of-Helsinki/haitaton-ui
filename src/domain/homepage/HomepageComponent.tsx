import React, { useState } from 'react';
import { Grid } from '@chakra-ui/react';
import { Koros, Link, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import styles from './Homepage.module.scss';
import img1 from './HKMS000005_km0000pi1k.webp';
import img2 from './HKMS000005_km0000pi1q.webp';
import img3 from './HKMS000005_km003yz2.webp';
import Linkbox from '../../common/components/Linkbox/Linkbox';

const Homepage: React.FC = () => {
  const { t } = useTranslation();
  const { MAP, HANKEPORTFOLIO, NEW_HANKE } = useLocalizedRoutes();
  const [feedbackOpen, setFeedbackOpen] = useState(true);

  const basicInfo = [
    {
      key: 'kartta',
      actionLink: MAP.path,
      imgProps: { src: img1, width: 384, height: 245 },
      external: false,
    },
    {
      key: 'hanke',
      actionLink: NEW_HANKE.path,
      imgProps: { src: img2, width: 384, height: 245 },
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
      actionLink:
        'https://www.hel.fi/helsinki/fi/asuminen-ja-ymparisto/tontit/luvat/kaduilla-ja-puistoissa-tehtavat-tyot/',
      imgProps: undefined,
      external: true,
    },
  ];

  return (
    <>
      <div className={styles.heroContainer}>
        <section className={styles.hero}>
          <Text tag="h1" styleAs="h1" spacing="s" weight="bold">
            {t('homepage:pageTitle')}
          </Text>
          <Text tag="h2" styleAs="h3" spacing="s" weight="bold">
            {t('homepage:pageSubTitle')}
          </Text>
        </section>
        <Koros type="basic" flipHorizontal className={styles.koros} />
      </div>

      <Container>
        <article className={styles.container}>
          {feedbackOpen && (
            <div className={styles.feedbackInfo}>
              <Notification
                label="Auta meitä tekemään Haitattomasta vielä parempi!"
                type="info"
                autoClose={false}
                dismissible
                closeButtonLabelText="Close"
                onClose={() => setFeedbackOpen(false)}
              >
                <p>
                  Ideoita ja havaintoja voit lähettää osoitteeseen
                  <Link href="mailto:haitaton@hel.fi">haitaton@hel.fi</Link>
                </p>
              </Notification>
            </div>
          )}

          <Grid
            templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
            gap={15}
            justifyContent="center"
            alignItems="start"
          >
            {basicInfo.map((item) => {
              return (
                <div className={styles.linkboxContainer} key={item.key}>
                  <Linkbox
                    linkboxAriaLabel={`Linkbox: ${t(`homepage:${item.key}:actionText`)}`}
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
        </article>
      </Container>
    </>
  );
};

export default Homepage;
