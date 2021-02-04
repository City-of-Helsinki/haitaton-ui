import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import HankeFormContainer from '../domain/hanke/edit/FormContainer';

interface Params {
  hankeTunnus: string;
}

type Props = RouteComponentProps<Params>;

const HankeFormPage: React.FC<Props> = ({
  match: {
    params: { hankeTunnus },
  },
}) => {
  const { EDIT_HANKE } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={EDIT_HANKE} />
      <HankeFormContainer hankeTunnus={hankeTunnus} />
    </Container>
  );
};

export default HankeFormPage;
