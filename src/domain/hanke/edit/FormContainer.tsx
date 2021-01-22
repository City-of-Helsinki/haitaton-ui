import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { actions as dialogActions } from '../../../common/components/confirmationDialog/reducer';
import { HANKE_SAVETYPE } from '../../types/hanke';
import { getHasFormChanged, getFormData, getShowNotification } from './selectors';
import { saveForm } from './thunks';
import { saveGeometryData } from '../../map/thunks';
import HankeForm from './Form';
import { actions, hankeDataDraft } from './reducer';
import { SaveFormArguments } from './types';

const HankeFormContainer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const hasFormChanged = useSelector(getHasFormChanged());
  const formData = useSelector(getFormData());
  const showNotification = useSelector(getShowNotification());

  const handleSave = ({ data, formPage }: SaveFormArguments) => {
    dispatch(
      saveForm({
        data,
        saveType: HANKE_SAVETYPE.DRAFT,
        formPage,
      })
    );
  };

  const handleSaveGeometry = (hankeTunnus: string) => {
    dispatch(saveGeometryData({ hankeTunnus }));
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
      history.push('/');
    }
  }, [hasFormChanged]);

  return (
    <HankeForm
      formData={formData}
      showNotification={showNotification}
      onSave={handleSave}
      onSaveGeometry={handleSaveGeometry}
      onIsDirtyChange={handleIsDirtyChange}
      onUnmount={handleUnmount}
      onFormClose={handleFormClose}
    />
  );
};

export default HankeFormContainer;
