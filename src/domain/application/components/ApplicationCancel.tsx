import React, { useState } from 'react';
import { ButtonVariant } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { AlluStatusStrings } from '../types/application';
import { isApplicationPending, cancelApplication, isApplicationCancelled } from '../utils';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import {
  useNavigateToApplicationList,
  useNavigateToHankeList,
} from '../../hanke/hooks/useNavigateToApplicationList';
import useDebouncedMutation from '../../../common/hooks/useDebouncedMutation';
import Button from '../../../common/components/button/Button';

type Props = {
  applicationId: number | null;
  alluStatus: AlluStatusStrings | null;
  hankeTunnus?: string;
  buttonIcon: JSX.Element;
  saveAndQuitIsLoading?: boolean;
  saveAndQuitIsLoadingText?: string;
};

export const ApplicationCancel: React.FC<Props> = ({
  applicationId,
  alluStatus,
  hankeTunnus,
  buttonIcon,
  saveAndQuitIsLoading,
  saveAndQuitIsLoadingText,
}) => {
  const { t } = useTranslation();
  const navigateToApplicationList = useNavigateToApplicationList(hankeTunnus);
  const navigateToHankeList = useNavigateToHankeList();

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const isCancelPossible = isApplicationPending(alluStatus) || isApplicationCancelled(alluStatus);

  const { setNotification } = useGlobalNotification();

  const applicationCancelMutation = useDebouncedMutation(cancelApplication, {
    onError(error: AxiosError) {
      let message = t('common:error');
      if (error.response?.status === 409) {
        message = t('hakemus:errors:cancelConflict');
      }
      setErrorMessage(message);
      setIsButtonDisabled(false);
    },
    onSuccess(data) {
      const closeButtonLabelText = t('common:components:notification:closeButtonLabelText');
      setNotification(true, {
        label: t('hakemus:notifications:cancelSuccessLabel'),
        message: t('hakemus:notifications:cancelSuccessText'),
        type: 'success',
        dismissible: true,
        closeButtonLabelText,
        autoClose: true,
        autoCloseDuration: 7000,
      });
      data?.hankeDeleted ? navigateToHankeList() : navigateToApplicationList();
    },
  });

  function doApplicationCancel() {
    setIsButtonDisabled(true);
    applicationCancelMutation.mutate(applicationId);
  }

  function openConfirmationDialog() {
    setIsConfirmationDialogOpen(true);
  }

  function closeConfirmationDialog() {
    setErrorMessage('');
    setIsConfirmationDialogOpen(false);
  }

  if (!isCancelPossible) {
    return null;
  }

  return (
    <>
      <ConfirmationDialog
        title={t('hakemus:labels:cancelTitle')}
        description={t('hakemus:labels:cancelDescription')}
        isOpen={isConfirmationDialogOpen}
        close={closeConfirmationDialog}
        mainAction={doApplicationCancel}
        mainBtnLabel={t('common:confirmationDialog:confirmButton')}
        variant="danger"
        errorMsg={errorMessage}
        isLoading={applicationCancelMutation.isLoading || isButtonDisabled}
      />

      <Button
        variant={ButtonVariant.Danger}
        iconStart={buttonIcon}
        onClick={openConfirmationDialog}
        isLoading={saveAndQuitIsLoading || isButtonDisabled}
        loadingText={saveAndQuitIsLoadingText}
        disabled={isButtonDisabled}
      >
        {t('hakemus:buttons:cancelApplication')}
      </Button>
    </>
  );
};
