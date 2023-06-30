import React from 'react';
import { Container as HdsContainer, Link } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import { SKIP_TO_ELEMENT_ID } from '../../common/constants/constants';

const PrivacyPolicyPage: React.FC = () => {
  const { PRIVACY_POLICY } = useLocalizedRoutes();

  const { t } = useTranslation();
  return (
    <Container>
      <PageMeta routeData={PRIVACY_POLICY} />
      <Text
        tag="h1"
        styleAs="h1"
        spacingTop="l"
        spacingBottom="xl"
        weight="bold"
        id={SKIP_TO_ELEMENT_ID}
        tabIndex={-1}
      >
        {t('staticPages:privacyPolicy:title')}
      </Text>

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <p style={{ marginBottom: 'var(--spacing-s)' }}>
          <Link
            href={t('staticPages:privacyPolicy:linkUrl')}
            rel="noreferrer"
            style={{ color: 'var(--color-coat-of-arms)' }}
            openInNewTab
          >
            {t('staticPages:privacyPolicy:linkText')}
          </Link>
        </p>
        <p>
          <Link
            href={t('staticPages:privacyPolicy:secondLinkUrl')}
            rel="noreferrer"
            style={{ color: 'var(--color-coat-of-arms)' }}
            openInNewTab
          >
            {t('staticPages:privacyPolicy:secondLinkText')}
          </Link>
        </p>
      </HdsContainer>
    </Container>
  );
};

export default PrivacyPolicyPage;
