import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';

const AccessibilityPage: React.FC = () => {
  const { ACCESSIBILITY } = useLocalizedRoutes();
  const { t } = useTranslation();

  return (
    <Container>
      <PageMeta routeData={ACCESSIBILITY} />
      <Text tag="h1" styleAs="h2" spacing="s" weight="bold">
        {t('staticPages:accessibility:title')}
      </Text>

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <p>{t('staticPages:accessibility:content')}</p>
      </HdsContainer>
    </Container>
  );
};

export default AccessibilityPage;
