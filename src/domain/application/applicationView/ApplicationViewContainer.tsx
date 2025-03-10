import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Flex } from '@chakra-ui/react';
import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import ApplicationView from './ApplicationView';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import useHanke from '../../hanke/hooks/useHanke';
import { useApplication } from '../hooks/useApplication';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { HAKEMUS_ROUTES, HAKEMUS_TAYDENNYS_ROUTES, ROUTES } from '../../../common/types/route';
import { usePermissionsForHanke } from '../../hanke/hankeUsers/hooks/useUserRightsForHanke';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import useCreateTaydennys from '../taydennys/hooks/useCreateTaydennys';
import useCreateMuutosilmoitus from '../muutosilmoitus/hooks/useCreateMuutosilmoitus';
import { MuutosLabelProvider } from '../taydennysAndMuutosilmoitusCommon/MuutosLabelContext';

type Props = {
  id: number;
};

function ApplicationViewContainer({ id }: Readonly<Props>) {
  const { t } = useTranslation();
  const { data: application, isLoading, isError, error } = useApplication(id);
  const applicationId = application?.id;
  const { data: hanke } = useHanke(application?.hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(application?.hankeTunnus ?? undefined);
  const navigate = useNavigate();
  const getEditApplicationPath = useLinkPath(
    HAKEMUS_ROUTES[application?.applicationType ?? 'CABLE_REPORT'],
  );
  const getEditTaydennysPath = useLinkPath(
    HAKEMUS_TAYDENNYS_ROUTES[application?.applicationType ?? 'CABLE_REPORT'],
  );
  const getEditMuutosilmoitusPath = useLinkPath(ROUTES.EDIT_KAIVUILMOITUSMUUTOSILMOITUS);
  const createTaydennysMutation = useCreateTaydennys();
  const createMuutosilmoitusMutation = useCreateMuutosilmoitus();

  function editApplication() {
    if (applicationId) {
      navigate(getEditApplicationPath({ id: applicationId.toString() }));
    }
  }

  function editTaydennys() {
    if (applicationId) {
      if (!application?.taydennys) {
        // If there is no taydennys, create one
        createTaydennysMutation.mutate(applicationId, {
          onSuccess() {
            navigate(getEditTaydennysPath({ id: applicationId.toString() }));
          },
        });
      } else {
        navigate(getEditTaydennysPath({ id: applicationId.toString() }));
      }
    }
  }

  function editMuutosilmoitus() {
    if (applicationId) {
      if (!application?.muutosilmoitus) {
        // If there is no muutosilmoitus, create one
        createMuutosilmoitusMutation.mutate(applicationId, {
          onSuccess() {
            navigate(getEditMuutosilmoitusPath({ id: applicationId.toString() }));
          },
        });
      } else {
        navigate(getEditMuutosilmoitusPath({ id: applicationId.toString() }));
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
    <MuutosLabelProvider
      value={
        application.taydennys ? t('taydennys:labels:taydennys') : t('muutosilmoitus:labels:muutos')
      }
    >
      <ApplicationView
        application={application}
        hanke={hanke}
        signedInUser={signedInUser}
        onEditApplication={editApplication}
        onEditTaydennys={editTaydennys}
        creatingTaydennys={createTaydennysMutation.isLoading}
        onEditMuutosilmoitus={editMuutosilmoitus}
        creatingMuutosilmoitus={createMuutosilmoitusMutation.isLoading}
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
      {createMuutosilmoitusMutation.isError && (
        <Notification
          position="top-right"
          dismissible
          type="error"
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={() => createMuutosilmoitusMutation.reset()}
        >
          {t('common:error')}
        </Notification>
      )}
    </MuutosLabelProvider>
  );
}

export default ApplicationViewContainer;
