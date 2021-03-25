import React from 'react';
import HankeMapContainer from '../domain/map/HankeMap';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';

const HomePage: React.FC = () => {
  const { HOME } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={HOME} />
      <HankeMapContainer />
    </>
  );
};

export default HomePage;
