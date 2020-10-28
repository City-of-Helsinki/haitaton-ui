import React from 'react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';

const HomePage: React.FC = () => {
  const { HOME } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={HOME} />
      <h1 data-testid="pageHeader">Haitaton 2.0</h1>
    </>
  );
};

export default HomePage;
