import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import Container from '../common/components/container/Container';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import { useApplication } from '../domain/application/hooks/useApplication';
import LoadingSpinner from '../common/components/spinner/LoadingSpinner';
import ErrorLoadingText from '../common/components/errorLoadingText/ErrorLoadingText';
import { Application, KaivuilmoitusData } from '../domain/application/types/application';
import useHanke from '../domain/hanke/hooks/useHanke';
import KaivuilmoitusMuutosilmoitusContainer from '../domain/kaivuilmoitusMuutosilmoitus/KaivuilmoitusMuutosilmoitusContainer';
import { Muutosilmoitus } from '../domain/application/muutosilmoitus/types';

export default function EditKaivuilmoitusMuutosilmoitusPage() {
  const { EDIT_KAIVUILMOITUSMUUTOSILMOITUS } = useLocalizedRoutes();
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
    !applicationQueryResult.data?.muutosilmoitus
  ) {
    return <ErrorLoadingText />;
  }

  if (!applicationQueryResult.data || !hankeQueryResult.data) {
    return null;
  }

  return (
    <Container>
      <PageMeta routeData={EDIT_KAIVUILMOITUSMUUTOSILMOITUS} />
      <KaivuilmoitusMuutosilmoitusContainer
        muutosilmoitus={
          applicationQueryResult.data.muutosilmoitus as Muutosilmoitus<KaivuilmoitusData>
        }
        originalApplication={applicationQueryResult.data as Application<KaivuilmoitusData>}
        hankeData={hankeQueryResult.data}
      />
    </Container>
  );
}
