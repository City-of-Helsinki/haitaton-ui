import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import ApplicationViewContainer from '../domain/application/applicationView/ApplicationViewContainer';
import PageMeta from './components/PageMeta';

const ApplicationPage: React.FC = () => {
  const { id } = useParams();
  const { HAKEMUS } = useLocalizedRoutes();

  const applicationId = Number(id);

  return (
    <>
      <PageMeta routeData={HAKEMUS} />
      <ApplicationViewContainer id={applicationId} />
    </>
  );
};

export default ApplicationPage;
