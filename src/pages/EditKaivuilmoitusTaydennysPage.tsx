import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import Container from '../common/components/container/Container';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import { useApplication } from '../domain/application/hooks/useApplication';
import LoadingSpinner from '../common/components/spinner/LoadingSpinner';
import ErrorLoadingText from '../common/components/errorLoadingText/ErrorLoadingText';
import { Taydennys } from '../domain/application/taydennys/types';
import { Application, KaivuilmoitusData } from '../domain/application/types/application';
import useHanke from '../domain/hanke/hooks/useHanke';
import KaivuilmoitusTaydennysContainer from '../domain/kaivuilmoitusTaydennys/KaivuilmoitusTaydennysContainer';

export default function EditKaivuilmoitusTaydennysPage() {
  const { EDIT_KAIVUILMOITUSTAYDENNYS } = useLocalizedRoutes();
  const { id } = useParams();
  const applicationQueryResult = useApplication(Number(id));
  const hankeQueryResult = useHanke(applicationQueryResult.data?.hankeTunnus);

  if (applicationQueryResult.isLoading || hankeQueryResult.isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  if (
    applicationQueryResult.error ||
    hankeQueryResult.error ||
    Number.isNaN(Number(id)) ||
    !applicationQueryResult.data?.taydennys
  ) {
    return <ErrorLoadingText />;
  }

  if (!applicationQueryResult.data || !hankeQueryResult.data) {
    return null;
  }

  return (
    <Container>
      <PageMeta routeData={EDIT_KAIVUILMOITUSTAYDENNYS} />
      <KaivuilmoitusTaydennysContainer
        taydennys={applicationQueryResult.data.taydennys as Taydennys<KaivuilmoitusData>}
        originalApplication={applicationQueryResult.data as Application<KaivuilmoitusData>}
        hankeData={hankeQueryResult.data}
      />
    </Container>
  );
}
