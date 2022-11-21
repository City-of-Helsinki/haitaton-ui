import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import HankeMapContainer from '../domain/map/HankeMap';

const MapPage: React.FC = () => {
  const { PUBLIC_HANKKEET_MAP } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={PUBLIC_HANKKEET_MAP} />
      <HankeMapContainer />
    </>
  );
};

export default MapPage;
