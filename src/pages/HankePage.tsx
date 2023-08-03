import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeViewContainer from '../domain/hanke/hankeView/HankeViewContainer';
import PageMeta from './components/PageMeta';

const HankePage: React.FC = () => {
  const { hankeTunnus } = useParams();
  const { HANKE } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={HANKE} />
      <HankeViewContainer hankeTunnus={hankeTunnus} />
    </>
  );
};

export default HankePage;
