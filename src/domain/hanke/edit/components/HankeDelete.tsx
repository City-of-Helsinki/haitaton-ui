import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { useLocalizedRoutes } from '../../../../common/hooks/useLocalizedRoutes';
import api from '../../../api/api';
import { HankeDataDraft } from '../../../types/hanke';

function deleteHanke(hankeTunnus: string) {
  return api.delete<HankeDataDraft>(`/hankkeet/${hankeTunnus}`);
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  hankeTunnus?: string;
  navigatePath?: string;
};

const HankeDelete: React.FC<Props> = ({ isOpen, onClose, hankeTunnus, navigatePath }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const { HANKEPORTFOLIO } = useLocalizedRoutes();

  async function handleDeleteHanke() {
    if (hankeTunnus) {
      try {
        await deleteHanke(hankeTunnus);
        navigate(navigatePath || HANKEPORTFOLIO.path);
      } catch (error) {
        setDeleteErrorMsg(t('common:error'));
      }
    }
  }

  function handleClose() {
    onClose();
    setDeleteErrorMsg('');
  }

  return (
    <ConfirmationDialog
      title={t('common:confirmationDialog:deleteDialog:titleText')}
      description={t('common:confirmationDialog:deleteDialog:bodyText')}
      isOpen={isOpen}
      close={handleClose}
      mainAction={() => handleDeleteHanke()}
      mainBtnLabel={t('common:confirmationDialog:deleteDialog:exitButton')}
      variant="danger"
      errorMsg={deleteErrorMsg}
    />
  );
};

export default HankeDelete;
