import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeListContainer from '../domain/hanke/list/HankeListContainer';

const HankeListPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { PUBLIC_HANKKEET_LIST } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={PUBLIC_HANKKEET_LIST} />
      <HankeListContainer />
    </Container>
  );
};

export default HankeListPage;
