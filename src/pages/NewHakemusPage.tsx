import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HakemusContainer from '../domain/hanke/newForm/HakemusContainer';

const NewHakemusPage: React.FC = () => {
  const { HAKEMUS } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={HAKEMUS} />
      <HakemusContainer />
    </Container>
  );
};

export default NewHakemusPage;
