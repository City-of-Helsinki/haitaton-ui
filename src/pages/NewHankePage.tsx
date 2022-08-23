import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HakemusContainer from '../domain/hanke/newForm/HakemusContainer';

const NewHankePage: React.FC = () => {
  const { NEW_HANKE } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={NEW_HANKE} />
      <HakemusContainer />
    </Container>
  );
};

export default NewHankePage;
