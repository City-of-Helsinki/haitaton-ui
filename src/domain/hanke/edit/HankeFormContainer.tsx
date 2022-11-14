import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Flex } from '@chakra-ui/react';
import { LoadingSpinner } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { HankeDataDraft } from '../../types/hanke';
import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';
import { convertHankeDataToFormState } from './utils';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import api from '../../api/api';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';

const getHanke = async (hankeTunnus?: string) => {
  const { data } = await api.get<HankeDataDraft>(`/hankkeet/${hankeTunnus}`);
  return data;
};

const deleteHanke = (hankeTunnus: string) => {
  return api.delete<HankeDataDraft>(`/hankkeet/${hankeTunnus}`);
};

const useHanke = (hankeTunnus?: string) =>
  useQuery<HankeDataDraft>(['hanke', hankeTunnus], () => getHanke(hankeTunnus), {
    enabled: !!hankeTunnus,
  });

type Props = {
  hankeTunnus?: string;
};

const HankeFormContainer: React.FC<React.PropsWithChildren<Props>> = ({ hankeTunnus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interruptDialogOpen, setInterruptDialogOpen] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const [hasFormChanged, setHasFormChanged] = useState(false);
  const [hankeTunnusToDelete, setHankeTunnusToDelete] = useState<string | undefined>();

  const { HANKEPORTFOLIO } = useLocalizedRoutes();

  const { data: hankeData, isLoading } = useHanke(hankeTunnus);
  const formData = convertHankeDataToFormState(hankeData);

  const handleIsDirtyChange = useCallback((isDirty: boolean) => {
    setHasFormChanged(isDirty);
  }, []);

  const openHankeDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteHanke = (hankeToDelete: HankeDataFormState) => {
    const id = hankeToDelete.hankeTunnus || hankeTunnusToDelete;
    if (id) {
      deleteHanke(id)
        .then(() => {
          navigate(HANKEPORTFOLIO.path);

          setDeleteDialogOpen(false);
        })
        .catch(() => {
          setDeleteErrorMsg(t('common:error'));
        });
    }
  };

  const handleFormClose = useCallback(
    (idToDelete?: string) => {
      // If close callback is called with hankeTunnus
      // meaning that form has already been saved and
      // one has been created, open delete dialog.
      if (idToDelete) {
        setHankeTunnusToDelete(idToDelete);
        openHankeDelete();
      } else if (hasFormChanged) {
        setInterruptDialogOpen(true);
      } else {
        navigate('/');
      }
    },
    [hasFormChanged, navigate]
  );

  const closeForm = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  return (
    <>
      <HankeForm
        formData={formData}
        onIsDirtyChange={handleIsDirtyChange}
        onFormClose={handleFormClose}
        onOpenHankeDelete={openHankeDelete}
      >
        <ConfirmationDialog
          title={t('common:confirmationDialog:deleteDialog:titleText')}
          description={t('common:confirmationDialog:deleteDialog:bodyText')}
          isOpen={deleteDialogOpen}
          close={() => {
            setDeleteDialogOpen(false);
            setDeleteErrorMsg('');
          }}
          mainAction={() => handleDeleteHanke(formData)}
          mainBtnLabel={t('common:confirmationDialog:deleteDialog:exitButton')}
          variant="danger"
          errorMsg={deleteErrorMsg}
        />
        <ConfirmationDialog
          title={t('common:confirmationDialog:interruptDialog:titleText')}
          description={t('common:confirmationDialog:interruptDialog:bodyText')}
          isOpen={interruptDialogOpen}
          close={() => setInterruptDialogOpen(false)}
          mainAction={closeForm}
          mainBtnLabel={t('common:confirmationDialog:interruptDialog:exitButton')}
          variant="primary"
        />
      </HankeForm>
    </>
  );
};

export default HankeFormContainer;
