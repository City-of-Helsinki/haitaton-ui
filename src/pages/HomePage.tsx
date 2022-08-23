import React from 'react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import Homepage from '../domain/homepage/HomepageComponent';
import Container from '../common/components/container/Container';

const HomePage: React.FC = () => {
  const { HOME } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={HOME} />
      <Container>
        <Homepage />
      </Container>
    </>
  );
};

export default HomePage;
