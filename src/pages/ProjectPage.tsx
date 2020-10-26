import React from 'react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeForm from '../domain/hanke/edit/Form';

const MapPage: React.FC = () => {
  const { MAP } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={MAP} />
      <HankeForm />
    </>
  );
};

export default MapPage;
