import React from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { LoadingSpinner } from 'hds-react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import JohtoselvitysContainer from '../domain/johtoselvitys/JohtoselvitysContainer';
import JohtoselvitysContainerNew from '../domain/johtoselvitys_new/JohtoselvitysContainer';
import { useApplication } from '../domain/application/hooks/useApplication';
import useHanke from '../domain/hanke/hooks/useHanke';
import ErrorLoadingText from '../common/components/errorLoadingText/ErrorLoadingText';
import { APPLICATION_ID_STORAGE_KEY } from '../domain/application/constants';
import { useFeatureFlags } from '../common/components/featureFlags/FeatureFlagsContext';

const EditJohtoselvitysPage: React.FC = () => {
  const { id } = useParams();
  const { EDIT_JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();
  const features = useFeatureFlags();

  const applicationQueryResult = useApplication(Number(id));
  const hankeQueryResult = useHanke(applicationQueryResult.data?.hankeTunnus);

  const applicationId = sessionStorage.getItem(APPLICATION_ID_STORAGE_KEY);
  if (applicationId) {
    sessionStorage.removeItem(APPLICATION_ID_STORAGE_KEY);
  }

  if (applicationQueryResult.isLoading || hankeQueryResult?.isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  if (applicationQueryResult.error) {
    return <ErrorLoadingText />;
  }

  return (
    <Container>
      <PageMeta routeData={EDIT_JOHTOSELVITYSHAKEMUS} />
      {features.accessRights ? (
        <JohtoselvitysContainerNew
          hankeData={hankeQueryResult?.data}
          application={applicationQueryResult.data}
        />
      ) : (
        <JohtoselvitysContainer
          hankeData={hankeQueryResult?.data}
          application={applicationQueryResult.data}
        />
      )}
    </Container>
  );
};

export default EditJohtoselvitysPage;
