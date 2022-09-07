import React from 'react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import Homepage from '../domain/homepage/HomepageComponent';

const HomePage: React.FC = () => {
  const { HOME } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={HOME} />
      <Homepage />
    </>
  );
};

export default HomePage;
