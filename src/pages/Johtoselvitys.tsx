import React from 'react';
import { Flex } from '@chakra-ui/react';
import { LoadingSpinner } from 'hds-react';
import { Navigate } from 'react-router-dom';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import JohtoselvitysContainer from '../domain/johtoselvitys/JohtoselvitysContainer';
import { useHankeDataInApplication } from '../domain/application/hooks/useHankeDataInApplication';
import useLinkPath from '../common/hooks/useLinkPath';
import { ROUTES } from '../common/types/route';
import { APPLICATION_ID_STORAGE_KEY } from '../domain/application/constants';

const Johtoselvitys: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();
  const getEditApplicationPath = useLinkPath(ROUTES.EDIT_JOHTOSELVITYSHAKEMUS);

  const result = useHankeDataInApplication();

  // Navigate to edit route if application id exists in session storage,
  // which means user refreshed the page while creating new application.
  const applicationId = sessionStorage.getItem(APPLICATION_ID_STORAGE_KEY);
  if (applicationId) {
    return <Navigate to={getEditApplicationPath({ id: applicationId })} />;
  }

  if (result?.isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  return (
    <Container>
      <PageMeta routeData={JOHTOSELVITYSHAKEMUS} />
      <JohtoselvitysContainer hankeData={result?.data} />
    </Container>
  );
};

export default Johtoselvitys;
