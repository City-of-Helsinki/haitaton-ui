import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { IconInfoCircle, LoadingSpinner } from 'hds-react';
import { useTranslation } from 'react-i18next';
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
import { Application, JohtoselvitysData } from '../domain/application/types/application';
import { isApplicationSent } from '../domain/application/utils';
import ConfirmationDialog from '../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useNavigateToApplicationView from '../domain/application/hooks/useNavigateToApplicationView';

const EditJohtoselvitysPage: React.FC = () => {
  const { id } = useParams();
  const { EDIT_JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();
  const features = useFeatureFlags();
  const { t } = useTranslation();
  const navigateToApplicationView = useNavigateToApplicationView(id);
  const [showApplicationSentDialog, setShowApplicationSentDialog] = useState(false);

  const applicationQueryResult = useApplication(Number(id));
  const hankeQueryResult = useHanke(applicationQueryResult.data?.hankeTunnus);

  useEffect(() => {
    if (isApplicationSent(applicationQueryResult.data?.alluStatus || null)) {
      setShowApplicationSentDialog(true);
    }
  }, [applicationQueryResult.data?.alluStatus]);

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

  if (applicationQueryResult.error || Number.isNaN(Number(id))) {
    return <ErrorLoadingText />;
  }

  return (
    <Container>
      <PageMeta routeData={EDIT_JOHTOSELVITYSHAKEMUS} />
      {features.accessRights ? (
        <JohtoselvitysContainerNew
          hankeData={hankeQueryResult?.data}
          application={applicationQueryResult.data as Application<JohtoselvitysData>}
        />
      ) : (
        <JohtoselvitysContainer
          hankeData={hankeQueryResult?.data}
          application={applicationQueryResult.data as Application<JohtoselvitysData>}
        />
      )}

      <ConfirmationDialog
        isOpen={showApplicationSentDialog}
        title={t('hakemus:sentDialog:title')}
        description={t('hakemus:sentDialog:description')}
        mainAction={navigateToApplicationView}
        mainBtnLabel={t('hakemus:sentDialog:button')}
        variant="primary"
        showSecondaryButton={false}
        headerIcon={<IconInfoCircle />}
      />
    </Container>
  );
};

export default EditJohtoselvitysPage;
