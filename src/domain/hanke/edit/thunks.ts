import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { HankeDataFormState } from './types';
import { HANKE_SAVETYPE_KEY } from '../../types/hanke';
import { saveGeometryData } from '../../map/thunks';
import { filterEmptyContacts, isHankeEditingDisabled } from './utils';

type SaveHankeData = {
  data: HankeDataFormState;
  saveType: HANKE_SAVETYPE_KEY;
  currentFormPage: number;
};

export const saveForm = createAsyncThunk(
  'form/saveData',
  async ({ data, saveType, currentFormPage }: SaveHankeData, thunkApi) => {
    const requestData = {
      ...filterEmptyContacts(data),
      saveType,
      createdBy: '1',
    };

    if (isHankeEditingDisabled(data)) {
      throw new Error('Editing disabled');
    }

    if (data.hankeTunnus && currentFormPage === 1) {
      thunkApi.dispatch(saveGeometryData({ hankeTunnus: data.hankeTunnus }));
    }

    const response = data.hankeTunnus
      ? await api.put<HankeDataFormState>(`/hankkeet/${data.hankeTunnus}`, requestData)
      : await api.post<HankeDataFormState>(`/hankkeet`, requestData);

    return response.data;
  }
);
