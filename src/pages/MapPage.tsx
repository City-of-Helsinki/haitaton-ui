import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import HankeDrawer from '../domain/map/HankeDrawer';

const MapPage: React.FC = () => {
  const { FORM } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={FORM} />
      <HankeDrawer hankeTunnus="1234567" />
    </>
  );
};

export default MapPage;
