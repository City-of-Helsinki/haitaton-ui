import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';

const ReferencesPage: React.FC = () => {
  const { HAITATON_INFO } = useLocalizedRoutes();
  const { t } = useTranslation();
  const referenceKeys = ['HEKAYL', 'HEKAKA', 'OPSTMA', 'HSL', 'MAMILA', 'HEKAKATO'];

  return (
    <Container>
      <PageMeta routeData={HAITATON_INFO} />
      <Text tag="h1" styleAs="h2" spacing="s" weight="bold">
        {t('staticPages:references:title')}
      </Text>
      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <p>{t('staticPages:references:content')}</p>
        {referenceKeys.map((referenceKey) => (
          <p>{t(`staticPages:references:referenceData:${referenceKey}.title`)}</p>
        ))}
      </HdsContainer>
    </Container>
  );
};

export default ReferencesPage;
