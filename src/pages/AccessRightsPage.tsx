import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import AccessRightsViewContainer from '../domain/hanke/accessRights/AccessRightsViewContainer';
import { useParams } from 'react-router-dom';

function AccessRightsPage() {
  const { hankeTunnus } = useParams();
  const { ACCESS_RIGHTS } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={ACCESS_RIGHTS} />
      <AccessRightsViewContainer hankeTunnus={hankeTunnus!} />
    </>
  );
}

export default AccessRightsPage;
