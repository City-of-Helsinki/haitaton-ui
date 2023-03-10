import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Button, IconCross } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { AlluStatusStrings } from '../types/application';
import { canApplicationBeCancelled, cancelApplication } from '../utils';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import useNavigateToApplicationList from '../../hanke/hooks/useNavigateToApplicationList';

type Props = {
  applicationId: number | null;
  alluStatus: AlluStatusStrings | null;
  hankeTunnus: string;
};

export const ApplicationCancel: React.FC<Props> = ({ applicationId, alluStatus, hankeTunnus }) => {
  const { t } = useTranslation();
  const navigateToApplicationList = useNavigateToApplicationList(hankeTunnus);

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isCancelPossible = canApplicationBeCancelled(alluStatus);

  const { setNotification } = useGlobalNotification();

  const applicationCancelMutation = useMutation(cancelApplication, {
    onError(error: AxiosError) {
      let message = t('common:error');
      if (error.response?.status === 409) {
        message = t('hakemus:errors:cancelConflict');
      }
      setErrorMessage(message);
    },
    onSuccess() {
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
      navigateToApplicationList();
    },
  });

  function doApplicationCancel() {
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
        mainBtnLabel={t('hakemus:buttons:cancelApplication')}
        variant="danger"
        errorMsg={errorMessage}
      />

      <Button
        variant="secondary"
        iconLeft={<IconCross aria-hidden />}
        onClick={openConfirmationDialog}
      >
        {t('hakemus:buttons:cancelApplication')}
      </Button>
    </>
  );
};
