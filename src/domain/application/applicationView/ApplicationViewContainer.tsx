import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { LoadingSpinner } from 'hds-react';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ApplicationView from './ApplicationView';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import useHanke from '../../hanke/hooks/useHanke';
import { useApplication } from '../hooks/useApplication';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { HAKEMUS_ROUTES } from '../../../common/types/route';
import { usePermissionsForHanke } from '../../hanke/hankeUsers/hooks/useUserRightsForHanke';

type Props = {
  id: number;
};

function ApplicationViewContainer({ id }: Readonly<Props>) {
  const { t } = useTranslation();
  const { data: application, isLoading, isError, error } = useApplication(id);
  const { data: hanke } = useHanke(application?.hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(application?.hankeTunnus ?? undefined);
  const navigate = useNavigate();
  const getEditApplicationPath = useLinkPath(
    HAKEMUS_ROUTES[application?.applicationType ?? 'CABLE_REPORT'],
  );

  function editApplication() {
    if (application?.id) {
      navigate(getEditApplicationPath({ id: application?.id.toString() }));
    }
  }

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner
          loadingText={t('common:components:loadingSpinner:loadingText')}
          loadingFinishedText={t('common:components:loadingSpinner:loadingFinishedText')}
        />
      </Flex>
    );
  }

  if ((isError && (error as AxiosError).response?.status === 404) || Number.isNaN(id)) {
    return <ErrorLoadingText>{t('hakemus:errors:notFound')}</ErrorLoadingText>;
  }

  if (isError) {
    return <ErrorLoadingText />;
  }

  if (!application) {
    return null;
  }

  return (
    <ApplicationView
      application={application}
      hanke={hanke}
      signedInUser={signedInUser}
      onEditApplication={editApplication}
    />
  );
}

export default ApplicationViewContainer;
