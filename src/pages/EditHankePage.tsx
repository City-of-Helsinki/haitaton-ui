import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeFormContainer from '../domain/hanke/edit/FormContainer';

const HankeFormPage = () => {
  const { hankeTunnus } = useParams();
  const { EDIT_HANKE } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={EDIT_HANKE} />
      <HankeFormContainer hankeTunnus={hankeTunnus} />
    </Container>
  );
};

export default HankeFormPage;
