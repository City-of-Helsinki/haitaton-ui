import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import Container from '../common/components/container/Container';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import JohtoselvitysTaydennysContainer from '../domain/johtoselvitysTaydennys/JohtoselvitysTaydennysContainer';
import PageMeta from './components/PageMeta';
import { useApplication } from '../domain/application/hooks/useApplication';
import LoadingSpinner from '../common/components/spinner/LoadingSpinner';
import ErrorLoadingText from '../common/components/errorLoadingText/ErrorLoadingText';
import { Taydennys } from '../domain/application/taydennys/types';
import { Application, JohtoselvitysData } from '../domain/application/types/application';
import useHanke from '../domain/hanke/hooks/useHanke';

export default function EditJohtoselvitysTaydennysPage() {
  const { EDIT_JOHTOSELVITYSTAYDENNYS } = useLocalizedRoutes();
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
      <PageMeta routeData={EDIT_JOHTOSELVITYSTAYDENNYS} />
      <JohtoselvitysTaydennysContainer
        taydennys={applicationQueryResult.data.taydennys as Taydennys<JohtoselvitysData>}
        originalApplication={applicationQueryResult.data as Application<JohtoselvitysData>}
        hankeData={hankeQueryResult.data}
      />
    </Container>
  );
}
