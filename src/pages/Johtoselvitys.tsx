import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import JohtoselvitysContainer from '../domain/johtoselvitys/JohtoselvitysContainer';

const Johtoselvitys: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={JOHTOSELVITYSHAKEMUS} />
      <JohtoselvitysContainer />
    </Container>
  );
};

export default Johtoselvitys;
