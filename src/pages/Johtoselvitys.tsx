import React from 'react';
import { Flex } from '@chakra-ui/react';
import { LoadingSpinner } from 'hds-react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import JohtoselvitysContainer from '../domain/johtoselvitys/JohtoselvitysContainer';
import { useHankeDataInApplication } from '../domain/application/hooks/useHankeDataInApplication';

const Johtoselvitys: React.FC = () => {
  const { JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();

  const result = useHankeDataInApplication();

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
