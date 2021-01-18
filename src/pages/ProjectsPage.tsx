import React from 'react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeListContainer from '../domain/hanke/list/HankeListContainer';

const ProjectListPage: React.FC = () => {
  const { PROJECTS } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={PROJECTS} />
      <HankeListContainer />
    </>
  );
};

export default ProjectListPage;
