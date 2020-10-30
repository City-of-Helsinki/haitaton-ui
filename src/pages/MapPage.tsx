import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import DrawMap from '../domain/hanke/map/Draw';

const MapPage: React.FC = () => {
  const { FORM } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={FORM} />
      <DrawMap />
    </>
  );
};

export default MapPage;
