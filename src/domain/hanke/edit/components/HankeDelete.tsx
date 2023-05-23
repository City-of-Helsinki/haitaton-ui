import { AxiosError } from 'axios';
import { IconTrash } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGlobalNotification } from '../../../../common/components/globalNotification/GlobalNotificationContext';
import ConfirmationDialog from '../../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { useLocalizedRoutes } from '../../../../common/hooks/useLocalizedRoutes';
import useHankeDelete from '../../hooks/useHankeDelete';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  hankeTunnus?: string;
  navigatePath?: string;
};

const HankeDelete: React.FC<Props> = ({ isOpen, onClose, hankeTunnus, navigatePath }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hankeDeleteMutation = useHankeDelete();
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const { HANKEPORTFOLIO } = useLocalizedRoutes();
  const [isActiveApplicationsDialogOpen, setIsActiveApplicationsDialogOpen] = useState(false);
  const { setNotification } = useGlobalNotification();

  function openActiveApplicationsDialog() {
    setIsActiveApplicationsDialogOpen(true);
  }

  function closeActiveApplicationsDialog() {
    setIsActiveApplicationsDialogOpen(false);
  }

  async function handleDeleteHanke() {
    if (hankeTunnus) {
      try {
        await hankeDeleteMutation.mutateAsync(hankeTunnus);

        const closeButtonLabelText = t('common:components:notification:closeButtonLabelText');
        setNotification(true, {
          label: t('hankeForm:cancelSuccessHeader'),
          message: t('hankeForm:cancelSuccessText'),
          type: 'success',
          dismissible: true,
          closeButtonLabelText,
          autoClose: true,
          autoCloseDuration: 7000,
        });

        navigate(navigatePath || HANKEPORTFOLIO.path);
      } catch (error) {
        if ((error as AxiosError).response?.status === 409) {
          onClose();
          openActiveApplicationsDialog();
        } else {
          setDeleteErrorMsg(t('common:error'));
        }
      }
    }
  }

  function handleClose() {
    onClose();
    setDeleteErrorMsg('');
  }

  return (
    <>
      <ConfirmationDialog
        variant="primary"
        isOpen={isActiveApplicationsDialogOpen}
        close={closeActiveApplicationsDialog}
        title={t('hankeForm:activeApplicationsHeader')}
        description={t('hankeForm:activeApplicationsDescription')}
        mainBtnLabel={t('common:ariaLabels:closeButtonLabelText')}
        mainAction={closeActiveApplicationsDialog}
        showSecondaryButton={false}
        showCloseButton
      />

      <ConfirmationDialog
        title={t('hankeForm:cancelDialog:titleText')}
        description={t('hankeForm:cancelDialog:bodyText')}
        isOpen={isOpen}
        close={handleClose}
        mainAction={() => handleDeleteHanke()}
        mainBtnLabel={t('common:confirmationDialog:confirmButton')}
        mainBtnIcon={<IconTrash aria-hidden="true" />}
        variant="danger"
        errorMsg={deleteErrorMsg}
        isLoading={hankeDeleteMutation.isLoading}
      />
    </>
  );
};

export default HankeDelete;
