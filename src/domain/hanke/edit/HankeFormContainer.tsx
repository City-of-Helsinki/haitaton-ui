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
import { HankeDataFormState, SaveFormArguments } from './types';
import { convertHankeDataToFormState } from './utils';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';

import api from '../../api/api';
import { t } from '../../../locales/i18nForTests';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import GenericForm from '../../forms/GenericForm';

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

const HankeFormContainer: React.FC<Props> = ({ hankeTunnus }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFormChanged = useSelector(getHasFormChanged());
  const formData = useSelector(getFormData());
  const isSaving = useSelector(getSaveState());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interruptDialogOpen, setInterruptDialogOpen] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

  const { HANKEPORTFOLIO } = useLocalizedRoutes();

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

  const handleDeleteHanke = (hankeToDelete: HankeDataFormState) => {
    if (hankeToDelete.hankeTunnus) {
      deleteHanke(hankeToDelete.hankeTunnus)
        .then(() => {
          navigate(HANKEPORTFOLIO.path);

          setDeleteDialogOpen(false);
        })
        .catch(() => {
          setDeleteErrorMsg(t('common:error'));
        });
    }
  };

  return (
    <>
      <GenericForm formData={formData} isSaving={isSaving}>
        aaaaa
      </GenericForm>
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
          mainAction={() => closeForm()}
          mainBtnLabel={t('common:confirmationDialog:interruptDialog:exitButton')}
          variant="primary"
        />
      </HankeForm>
    </>
  );
};

export default HankeFormContainer;
