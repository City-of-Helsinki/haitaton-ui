import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HakemusContainer from '../domain/hanke/newForm/HakemusContainer';

const HankeFormPage = () => {
  const { hankeTunnus } = useParams();
  const { EDIT_HANKE } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={EDIT_HANKE} />
      <HakemusContainer hankeTunnus={hankeTunnus} />
    </Container>
  );
};

export default HankeFormPage;
