import React from 'react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import H2 from '../common/components/text/H2';

const HomePage: React.FC = () => {
  const { HOME } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={HOME} />
      <H2 data-testid="pageHeader">Haitaton 2.0</H2>
    </>
  );
};

export default HomePage;
