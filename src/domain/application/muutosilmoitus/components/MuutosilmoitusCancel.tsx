import { useState } from 'react';
import { ButtonPresetTheme, ButtonVariant, IconCross, IconTrash } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Application } from '../../types/application';
import useNavigateToApplicationView from '../../hooks/useNavigateToApplicationView';
import { useGlobalNotification } from '../../../../common/components/globalNotification/GlobalNotificationContext';
import useDebouncedMutation from '../../../../common/hooks/useDebouncedMutation';
import ConfirmationDialog from '../../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { cancelMuutosilmoitus } from '../muutosilmoitusApi';
import Button from '../../../../common/components/button/Button';

type Props = {
  application: Application;
  navigateToApplicationViewOnSuccess?: boolean;
  buttonVariant?: ButtonVariant.Primary | ButtonVariant.Danger;
  buttonIsLoading?: boolean;
  buttonIsLoadingText?: string;
};

export default function MuutosilmoitusCancel({
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

  const isCancelPossible = Boolean(application.muutosilmoitus);

  const muutosilmoitusCancelMutation = useDebouncedMutation(cancelMuutosilmoitus, {
    onError() {
      setErrorMessage(t('common:error'));
      setIsButtonDisabled(false);
    },
    onSuccess() {
      const closeButtonLabelText = t('common:components:notification:closeButtonLabelText');
      setNotification(true, {
        label: t('muutosilmoitus:notification:cancelSuccessLabel'),
        message: t('muutosilmoitus:notification:cancelSuccessText'),
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
    if (application.muutosilmoitus?.id) {
      muutosilmoitusCancelMutation.mutate(application.muutosilmoitus.id);
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
        title={t('muutosilmoitus:labels:cancelTitle')}
        description={t('muutosilmoitus:labels:cancelDescription')}
        isOpen={isConfirmationDialogOpen}
        close={closeConfirmationDialog}
        mainAction={doApplicationCancel}
        mainBtnLabel={t('common:confirmationDialog:confirmButton')}
        mainBtnIcon={<IconTrash />}
        variant="danger"
        errorMsg={errorMessage}
        isLoading={muutosilmoitusCancelMutation.isLoading || isButtonDisabled}
        loadingText={t('common:buttons:sendingText')}
        disabled={muutosilmoitusCancelMutation.isLoading || isButtonDisabled}
      />

      <Button
        variant={buttonVariant}
        theme={ButtonPresetTheme.Coat}
        iconStart={<IconCross />}
        onClick={openConfirmationDialog}
        disabled={isButtonDisabled}
        isLoading={buttonIsLoading}
        loadingText={buttonIsLoadingText}
      >
        {t('muutosilmoitus:buttons:cancelMuutosilmoitus')}
      </Button>
    </>
  );
}
