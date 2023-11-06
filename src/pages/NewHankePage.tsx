import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeFormContainer from '../domain/hanke/edit/HankeFormContainer';

const NewHankePage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { NEW_HANKE } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={NEW_HANKE} />
      <HankeFormContainer />
    </Container>
  );
};

export default NewHankePage;
