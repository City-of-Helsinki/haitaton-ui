import React from 'react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeList from '../domain/hanke/list/HankeList';

const ProjectListPage: React.FC = () => {
  const { PROJECTS } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={PROJECTS} />
      <HankeList />
    </>
  );
};

export default ProjectListPage;
