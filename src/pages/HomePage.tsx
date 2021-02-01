import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import H1 from '../common/components/text/H1';

const HomePage: React.FC = () => {
  const { HOME } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={HOME} />
      <H1 data-testid="pageHeader" stylesAs="h2">
        Haitaton 2.0
      </H1>
    </Container>
  );
};

export default HomePage;
