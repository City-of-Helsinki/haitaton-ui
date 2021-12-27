import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { HANKE_SAVETYPE, HankeDataDraft } from '../../types/hanke';
import { getHasFormChanged, getFormData, getSaveState } from './selectors';
import { saveForm } from './thunks';
import { saveGeometryData } from '../../map/thunks';
import HankeForm from './HankeForm';
import { actions, hankeDataDraft } from './reducer';
import { SaveFormArguments } from './types';
import { convertHankeDataToFormState } from './utils';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';

import api from '../../api/api';
import { t } from '../../../locales/i18nForTests';

const getHanke = async (hankeTunnus?: string) => {
  const { data } = await api.get<HankeDataDraft>(`/hankkeet/${hankeTunnus}`);
  return data;
};

const useHanke = (hankeTunnus?: string) =>
  useQuery<HankeDataDraft>(['hanke', hankeTunnus], () => getHanke(hankeTunnus), {
    enabled: !!hankeTunnus,
  });

type Props = {
  hankeTunnus?: string;
};

const HankeFormContainer: React.FC<Props> = ({ hankeTunnus }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFormChanged = useSelector(getHasFormChanged());
  const formData = useSelector(getFormData());
  const isSaving = useSelector(getSaveState());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interruptDialogOpen, setInterruptDialogOpen] = useState(false);

  const { data: hankeData, isFetched } = useHanke(hankeTunnus);

  useEffect(() => {
    // Update fetched hankeData to redux
    if (hankeTunnus && isFetched && hankeData) {
      dispatch(actions.updateFormData(convertHankeDataToFormState(hankeData)));
    }
  }, [isFetched]);

  const handleSave = ({ data, currentFormPage }: SaveFormArguments) => {
    dispatch(
      saveForm({
        data,
        saveType: HANKE_SAVETYPE.DRAFT,
        currentFormPage,
      })
    );
  };

  const handleSaveGeometry = (id: string) => {
    dispatch(saveGeometryData({ hankeTunnus: id }));
  };

  const handleIsDirtyChange = (isDirty: boolean) => {
    dispatch(actions.updateHasFormChanged(isDirty));
  };

  // Clear form data on unmount
  const handleUnmount = () => {
    dispatch(actions.updateFormData(hankeDataDraft));
  };

  const handleFormClose = useCallback(() => {
    if (hasFormChanged) {
      setInterruptDialogOpen(true);
    } else {
      navigate('/');
    }
  }, [hasFormChanged]);

  const closeForm = () => {
    navigate('/');
  };

  const openHankeDelete = () => {
    setDeleteDialogOpen(true);
  };

  const deleteHanke = () => {
    // add actual delete functionality here
    setDeleteDialogOpen(false);
  };

  return (
    <HankeForm
      formData={formData}
      onSave={handleSave}
      onSaveGeometry={handleSaveGeometry}
      onIsDirtyChange={handleIsDirtyChange}
      onUnmount={handleUnmount}
      onFormClose={handleFormClose}
      isSaving={isSaving}
      onOpenHankeDelete={openHankeDelete}
    >
      <ConfirmationDialog
        title={t('common:confirmationDialog:deleteDialog:titleText')}
        description={t('common:confirmationDialog:deleteDialog:bodyText')}
        isOpen={deleteDialogOpen}
        close={() => setDeleteDialogOpen(false)}
        mainAction={() => deleteHanke()}
        mainBtnLabel={t('common:confirmationDialog:deleteDialog:exitButton')}
      />
      <ConfirmationDialog
        title={t('common:confirmationDialog:interruptDialog:titleText')}
        description={t('common:confirmationDialog:interruptDialog:bodyText')}
        isOpen={interruptDialogOpen}
        close={() => setInterruptDialogOpen(false)}
        mainAction={() => closeForm()}
        mainBtnLabel={t('common:confirmationDialog:interruptDialog:exitButton')}
      />
    </HankeForm>
  );
};

export default HankeFormContainer;
