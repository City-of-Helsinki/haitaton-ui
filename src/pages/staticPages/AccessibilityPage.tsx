import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import MainHeading from '../../common/components/mainHeading/MainHeading';
import styles from './StaticContent.module.scss';

const AccessibilityPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { ACCESSIBILITY } = useLocalizedRoutes();
  const { t } = useTranslation();

  const translationComponents = {
    h2: <h2 className="heading-l" />,
    h3: <h3 className="heading-m" />,
    h4: <h4 className="heading-s" />,
    ul: <ul />,
    li: <li />,
    p: <p />,
    b: <b />,
    internal: <a className="hds-link hds-link--medium" />,
    mailto: <a className="hds-link hds-link--medium" />,
    a: (
      <a
        className="hds-link hds-link--medium"
        aria-label={t('common:components:link:openInExternalDomainAriaLabel')}
      />
    ),
    span: <span />,
  };

  return (
    <Container>
      <PageMeta routeData={ACCESSIBILITY} />
      <MainHeading spacingTop="l" spacingBottom="xl">
        {t('staticPages:accessibility:title')}
      </MainHeading>
      <div className={styles.infopage}>
        <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
          <Trans
            i18nKey="staticPages:accessibility:content"
            components={translationComponents}
          ></Trans>
        </HdsContainer>
      </div>
    </Container>
  );
};

export default AccessibilityPage;
