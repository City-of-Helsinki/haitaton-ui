import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import HankePortfolioContainer from '../domain/hanke/portfolio/HankePortfolioContainer';

const HankePortfolioPage: React.FC = () => {
  const { HANKEPORTFOLIO } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={HANKEPORTFOLIO} />
      <HankePortfolioContainer />
    </>
  );
};

export default HankePortfolioPage;
