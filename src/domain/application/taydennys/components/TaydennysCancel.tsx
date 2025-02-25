import { useState } from 'react';
import { Button, IconCross, IconTrash } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Application } from '../../types/application';
import useNavigateToApplicationView from '../../hooks/useNavigateToApplicationView';
import { useGlobalNotification } from '../../../../common/components/globalNotification/GlobalNotificationContext';
import useDebouncedMutation from '../../../../common/hooks/useDebouncedMutation';
import ConfirmationDialog from '../../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { cancelTaydennys } from '../taydennysApi';

type Props = {
  application: Application;
  navigateToApplicationViewOnSuccess?: boolean;
  buttonVariant?: 'primary' | 'danger';
  buttonIsLoading?: boolean;
  buttonIsLoadingText?: string;
};

export default function TaydennysCancel({
  application,
  navigateToApplicationViewOnSuccess,
  buttonVariant,
  buttonIsLoading,
  buttonIsLoadingText,
}: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationView = useNavigateToApplicationView();

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const isCancelPossible = Boolean(application.taydennys);

  const taydennysCancelMutation = useDebouncedMutation(cancelTaydennys, {
    onError() {
      setErrorMessage(t('common:error'));
      setIsButtonDisabled(false);
    },
    onSuccess() {
      const closeButtonLabelText = t('common:components:notification:closeButtonLabelText');
      setNotification(true, {
        label: t('taydennys:notifications:cancelSuccessLabel'),
        message: t('taydennys:notifications:cancelSuccessText'),
        type: 'success',
        dismissible: true,
        closeButtonLabelText,
        autoClose: true,
        autoCloseDuration: 7000,
      });
      if (navigateToApplicationViewOnSuccess) {
        navigateToApplicationView(application.id?.toString());
      } else {
        queryClient.invalidateQueries(['application', application.id], { refetchInactive: true });
        setIsConfirmationDialogOpen(false);
        setIsButtonDisabled(false);
      }
    },
  });

  function doApplicationCancel() {
    setIsButtonDisabled(true);
    if (application.taydennys?.id) {
      taydennysCancelMutation.mutate(application.taydennys.id);
    }
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
        title={t('taydennys:labels:cancelTitle')}
        description={t('taydennys:labels:cancelDescription')}
        isOpen={isConfirmationDialogOpen}
        close={closeConfirmationDialog}
        mainAction={doApplicationCancel}
        mainBtnLabel={t('common:confirmationDialog:confirmButton')}
        mainBtnIcon={<IconTrash />}
        variant="danger"
        errorMsg={errorMessage}
        isLoading={taydennysCancelMutation.isLoading || isButtonDisabled}
      />

      <Button
        variant={buttonVariant}
        theme="coat"
        iconLeft={<IconCross />}
        onClick={openConfirmationDialog}
        isLoading={buttonIsLoading || isButtonDisabled}
        loadingText={buttonIsLoadingText}
        disabled={isButtonDisabled}
      >
        {t('taydennys:buttons:cancelTaydennys')}
      </Button>
    </>
  );
}
