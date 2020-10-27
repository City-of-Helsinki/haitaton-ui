import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import HankeMap from '../domain/hanke/map/HankeMap';

const MapPage: React.FC = () => {
  const { FORM } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={FORM} />
      <HankeMap />
    </>
  );

  return <HankeMap />;
};

export default MapPage;
