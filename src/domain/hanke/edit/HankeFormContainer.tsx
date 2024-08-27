import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import HankeForm from './HankeForm';
import { convertHankeDataToFormState } from './utils';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useHanke from '../hooks/useHanke';
import HankeDelete from './components/HankeDelete';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';

type Props = {
  hankeTunnus?: string;
};

const HankeFormContainer: React.FC<React.PropsWithChildren<Props>> = ({ hankeTunnus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interruptDialogOpen, setInterruptDialogOpen] = useState(false);
  const [hasFormChanged, setHasFormChanged] = useState(false);
  const [hankeTunnusToDelete, setHankeTunnusToDelete] = useState<string | undefined>();

  const { data: hankeData, isLoading } = useHanke(hankeTunnus);
  const formData = convertHankeDataToFormState(hankeData);

  const handleIsDirtyChange = useCallback((isDirty: boolean) => {
    setHasFormChanged(isDirty);
  }, []);

  const openHankeDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
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
    [hasFormChanged, navigate],
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
      >
        <HankeDelete
          isOpen={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          hankeTunnus={hankeTunnus || hankeTunnusToDelete}
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
