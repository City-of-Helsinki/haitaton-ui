import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { actions as dialogActions } from '../../../common/components/confirmationDialog/reducer';
import { HANKE_SAVETYPE, HankeDataDraft } from '../../types/hanke';
import { getHasFormChanged, getFormData } from './selectors';
import { saveForm } from './thunks';
import { saveGeometryData } from '../../map/thunks';
import HankeForm from './Form';
import { actions, hankeDataDraft } from './reducer';
import { SaveFormArguments } from './types';
import { convertHankeDataToFormState } from './utils';

import api from '../../api/api';

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
      dispatch(dialogActions.updateIsDialogOpen({ isDialogOpen: true, redirectUrl: '/' }));
    } else {
      navigate('/');
    }
  }, [hasFormChanged]);

  return (
    <HankeForm
      formData={formData}
      onSave={handleSave}
      onSaveGeometry={handleSaveGeometry}
      onIsDirtyChange={handleIsDirtyChange}
      onUnmount={handleUnmount}
      onFormClose={handleFormClose}
    />
  );
};

export default HankeFormContainer;
