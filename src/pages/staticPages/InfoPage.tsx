import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import { SKIP_TO_ELEMENT_ID } from '../../common/constants/constants';

const InfoPage: React.FC = () => {
  const { HAITATON_INFO } = useLocalizedRoutes();
  const { t } = useTranslation();

  return (
    <Container>
      <PageMeta routeData={HAITATON_INFO} />
      <Text
        tag="h1"
        styleAs="h1"
        spacingTop="l"
        spacingBottom="xl"
        weight="bold"
        id={SKIP_TO_ELEMENT_ID}
        tabIndex={-1}
      >
        {t('staticPages:infoPage:title')}
      </Text>

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <Text tag="h2" styleAs="h2" spacingBottom="s">
          {t('staticPages:infoPage:releaseInfo')}
        </Text>
        <ul style={{ paddingLeft: 'var(--spacing-l)', marginBottom: 'var(--spacing-s)' }}>
          <li>{t('staticPages:infoPage:releaseVer1')}</li>
        </ul>
        <Text tag="h2" styleAs="h2" spacingBottom="s">
          {t('staticPages:infoPage:materials')}
        </Text>
        <Text tag="h3" styleAs="h3" spacingBottom="s">
          {t('staticPages:infoPage:mapMaterials')}
        </Text>
        <Text tag="p" spacingBottom="s">
          Copyright Helsingin kaupunki
        </Text>
        <Text tag="h3" styleAs="h3" spacingBottom="s">
          {t('staticPages:infoPage:imageCopyrights')}
        </Text>
        <Text tag="p">Sakari Kiuru, Helsingin kaupunginmuseo</Text>
      </HdsContainer>
    </Container>
  );
};

export default InfoPage;
