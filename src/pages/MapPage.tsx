import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import HankeMap from '../domain/map/HankeMap';

const MapPage: React.FC = () => {
  const { MAP } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={MAP} />
      <HankeMap />
    </>
  );
};

export default MapPage;
