import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import MainHeading from '../../common/components/mainHeading/MainHeading';

const ReferencesPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { HAITATON_INFO } = useLocalizedRoutes();
  const { t } = useTranslation();
  const referenceKeys = ['HEKAYL', 'HEKAKA', 'OPSTMA', 'HSL', 'MAMILA', 'HEKAKATO'];

  return (
    <Container>
      <PageMeta routeData={HAITATON_INFO} />
      <MainHeading spacing="s">{t('staticPages:references:title')}</MainHeading>
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
