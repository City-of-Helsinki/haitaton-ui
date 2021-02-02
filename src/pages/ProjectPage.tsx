import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeFormContainer from '../domain/hanke/edit/FormContainer';

const MapPage: React.FC = () => {
  const { MAP } = useLocalizedRoutes();

  return (
    <>
      <Container>
        <PageMeta routeData={MAP} />
        <HankeFormContainer />
      </Container>
    </>
  );
};

export default MapPage;
