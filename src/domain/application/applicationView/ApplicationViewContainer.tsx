import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Flex } from '@chakra-ui/react';
import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ApplicationView from './ApplicationView';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import useHanke from '../../hanke/hooks/useHanke';
import { useApplication } from '../hooks/useApplication';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { HAKEMUS_ROUTES, HAKEMUS_TAYDENNYS_ROUTES } from '../../../common/types/route';
import { usePermissionsForHanke } from '../../hanke/hankeUsers/hooks/useUserRightsForHanke';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import useCreateTaydennys from '../taydennys/hooks/useCreateTaydennys';

type Props = {
  id: number;
};

function ApplicationViewContainer({ id }: Readonly<Props>) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: application, isLoading, isError, error } = useApplication(id);
  const { data: hanke } = useHanke(application?.hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(application?.hankeTunnus ?? undefined);
  const navigate = useNavigate();
  const getEditApplicationPath = useLinkPath(
    HAKEMUS_ROUTES[application?.applicationType ?? 'CABLE_REPORT'],
  );
  const getEditTaydennysPath = useLinkPath(
    HAKEMUS_TAYDENNYS_ROUTES[application?.applicationType ?? 'CABLE_REPORT'],
  );
  const createTaydennysMutation = useCreateTaydennys();

  function editApplication() {
    if (application?.id) {
      navigate(getEditApplicationPath({ id: application?.id.toString() }));
    }
  }

  function editTaydennys() {
    const applicationId = application?.id;
    if (applicationId) {
      if (!application?.taydennys) {
        // If there is no taydennys, create one
        createTaydennysMutation.mutate(applicationId.toString(), {
          async onSuccess() {
            await queryClient.invalidateQueries(['application', applicationId], {
              refetchInactive: true,
            });
            navigate(getEditTaydennysPath({ id: applicationId.toString() }));
          },
        });
      } else {
        navigate(getEditTaydennysPath({ id: applicationId.toString() }));
      }
    }
  }

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
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
    <>
      <ApplicationView
        application={application}
        hanke={hanke}
        signedInUser={signedInUser}
        onEditApplication={editApplication}
        onEditTaydennys={editTaydennys}
        creatingTaydennys={createTaydennysMutation.isLoading}
      />
      {createTaydennysMutation.isError && (
        <Notification
          position="top-right"
          dismissible
          type="error"
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={() => createTaydennysMutation.reset()}
        >
          {t('common:error')}
        </Notification>
      )}
    </>
  );
}

export default ApplicationViewContainer;
