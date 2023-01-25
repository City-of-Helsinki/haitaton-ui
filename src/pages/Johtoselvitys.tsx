import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import JohtoselvitysContainer from '../domain/johtoselvitys/JohtoselvitysContainer';
import { useHankeDataInApplication } from '../domain/application/hooks/useHankeDataInApplication';

const Johtoselvitys: React.FC = () => {
  const { JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();

  const result = useHankeDataInApplication();

  // TODO: Case where there is no related hanke for new
  // cable application, will be implemented later
  if (result === null) {
    // eslint-disable-next-line no-console
    console.error('Provide hankeTunnus in URL search params, e.g. ?hanke=HAI22-1');
    return null;
  }

  if (result.isLoading || !result.data) return null;

  return (
    <Container>
      <PageMeta routeData={JOHTOSELVITYSHAKEMUS} />
      <JohtoselvitysContainer hanke={result.data} />
    </Container>
  );
};

export default Johtoselvitys;
