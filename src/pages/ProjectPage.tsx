import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeForm from '../domain/hanke/edit/Form';

const MapPage: React.FC = () => {
  const { MAP } = useLocalizedRoutes();

  return (
    <>
      <Container>
        <PageMeta routeData={MAP} />
        <HankeForm />
      </Container>
    </>
  );
};

export default MapPage;
