import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import Text from '../common/components/text/Text';

const HomePage: React.FC = () => {
  const { HOME } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={HOME} />
      <Text tag="h1" data-testid="pageHeader" styleAs="h2" spacing="s" weight="bold">
        Haitaton Beta
      </Text>
    </Container>
  );
};

export default HomePage;
