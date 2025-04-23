import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import MainHeading from '../../common/components/mainHeading/MainHeading';

const InfoPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { HAITATON_INFO } = useLocalizedRoutes();
  const { t } = useTranslation();

  return (
    <Container>
      <PageMeta routeData={HAITATON_INFO} />
      <MainHeading spacingTop="l" spacingBottom="xl">
        {t('staticPages:infoPage:title')}
      </MainHeading>

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <Text tag="h2" styleAs="h2" spacingBottom="s">
          {t('staticPages:infoPage:releaseInfo')}
        </Text>
        <ul style={{ paddingLeft: 'var(--spacing-l)', marginBottom: 'var(--spacing-s)' }}>
          <li>{t('staticPages:infoPage:releaseVer4')}</li>
          <li>{t('staticPages:infoPage:releaseVer3')}</li>
          <li>{t('staticPages:infoPage:releaseVer2')}</li>
          <li>{t('staticPages:infoPage:releaseVer1')}</li>
        </ul>
        <Text tag="p" spacingBottom="s">
          {t('staticPages:infoPage:releaseAdditionalInfo')}
        </Text>
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
