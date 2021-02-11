import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import HankeMapContainer from '../domain/map/HankeMapContainer';

const MapPage: React.FC = () => {
  const { MAP } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={MAP} />
      <HankeMapContainer />
    </>
  );
};

export default MapPage;
