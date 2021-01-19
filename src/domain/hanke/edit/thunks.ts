import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/utils/api';
import { HankeDataDraft, HANKE_SAVETYPE_KEY } from '../../types/hanke';
import { saveGeometryData } from '../../map/thunks';
import { filterEmptyContacts } from './utils';

type SaveHankeData = {
  data: HankeDataDraft;
  saveType: HANKE_SAVETYPE_KEY;
  formPage: number;
};

export const saveForm = createAsyncThunk(
  'form/saveData',
  async ({ data, saveType, formPage }: SaveHankeData, thunkApi) => {
    const requestData = {
      ...filterEmptyContacts(data),
      saveType,
      createdBy: '1',
    };

    if (data.hankeTunnus && formPage === 1) {
      thunkApi.dispatch(saveGeometryData({ hankeTunnus: data.hankeTunnus }));
    }

    const response = data.hankeTunnus
      ? await api.put<HankeDataDraft>(`/hankkeet/${data.hankeTunnus}`, requestData)
      : await api.post<HankeDataDraft>(`/hankkeet`, requestData);

    return response.data;
  }
);
