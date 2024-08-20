import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { LoadingSpinner } from 'hds-react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import KaivuilmoitusContainer from '../domain/kaivuilmoitus/KaivuilmoitusContainer';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import { useApplication } from '../domain/application/hooks/useApplication';
import useHanke from '../domain/hanke/hooks/useHanke';
import ErrorLoadingText from '../common/components/errorLoadingText/ErrorLoadingText';
import { Application, KaivuilmoitusData } from '../domain/application/types/application';
import { useTranslation } from 'react-i18next';

const EditKaivuilmoitusPage = () => {
  const { EDIT_KAIVUILMOITUSHAKEMUS } = useLocalizedRoutes();
  const { id } = useParams();
  const applicationQueryResult = useApplication(Number(id));
  const hankeQueryResult = useHanke(applicationQueryResult.data?.hankeTunnus);
  const { t } = useTranslation();

  if (applicationQueryResult.isLoading || hankeQueryResult?.isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner
          loadingText={t('common:components:loadingSpinner:loadingText')}
          loadingFinishedText={t('common:components:loadingSpinner:loadingFinishedText')}
        />
      </Flex>
    );
  }

  if (applicationQueryResult.error || hankeQueryResult?.error) {
    return <ErrorLoadingText />;
  }

  if (!applicationQueryResult.data || !hankeQueryResult?.data) {
    return null;
  }

  return (
    <Container>
      <PageMeta routeData={EDIT_KAIVUILMOITUSHAKEMUS} />
      <KaivuilmoitusContainer
        hankeData={hankeQueryResult.data}
        application={applicationQueryResult.data as Application<KaivuilmoitusData>}
      />
    </Container>
  );
};

export default EditKaivuilmoitusPage;
