import React from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { LoadingSpinner } from 'hds-react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import JohtoselvitysContainer from '../domain/johtoselvitys/JohtoselvitysContainer';
import { useHankeDataInApplication } from '../domain/application/hooks/useHankeDataInApplication';
import { useApplication } from '../domain/application/hooks/useApplication';
import ErrorLoadingText from '../common/components/errorLoadingText/ErrorLoadingText';

const EditJohtoselvitysPage: React.FC = () => {
  const { id } = useParams();
  const { EDIT_JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();

  const applicationQueryResult = useApplication(Number(id));
  const hankeQueryResult = useHankeDataInApplication();

  if (applicationQueryResult.isLoading || hankeQueryResult?.isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  if (applicationQueryResult.error) {
    return <ErrorLoadingText />;
  }

  return (
    <Container>
      <PageMeta routeData={EDIT_JOHTOSELVITYSHAKEMUS} />
      <JohtoselvitysContainer
        hankeData={hankeQueryResult?.data}
        application={applicationQueryResult.data}
      />
    </Container>
  );
};

export default EditJohtoselvitysPage;
