import React from 'react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeListContainer from '../domain/hanke/list/HankeListContainer';

const ProjectListPage: React.FC = () => {
  const { PROJECTS } = useLocalizedRoutes();

  return (
    <>
      <Container>
        <PageMeta routeData={PROJECTS} />
        <HankeListContainer />
      </Container>
    </>
  );
};

export default ProjectListPage;
