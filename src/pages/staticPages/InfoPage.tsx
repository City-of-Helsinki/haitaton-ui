import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';

const InfoPage: React.FC = () => {
  const { HAITATON_INFO } = useLocalizedRoutes();
  const { t } = useTranslation();

  return (
    <Container>
      <PageMeta routeData={HAITATON_INFO} />
      <Text tag="h1" styleAs="h2" spacing="s" weight="bold">
        {t('staticPages:info:title')}
      </Text>

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <p>{t('staticPages:info:content')}</p>
      </HdsContainer>
    </Container>
  );
};

export default InfoPage;
