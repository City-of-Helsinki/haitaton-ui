import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/utils/api';
import { HankeDataDraft, HANKE_SAVETYPE_KEY } from './types';
import { filterEmptyContacts } from './utils';

type SaveHankeData = {
  data: HankeDataDraft;
  saveType: HANKE_SAVETYPE_KEY;
};

export const saveForm = createAsyncThunk(
  'form/saveData',
  async ({ data, saveType }: SaveHankeData) => {
    const requestData = {
      ...filterEmptyContacts(data),
      saveType,
      createdBy: '1',
    };

    const response = data.hankeTunnus
      ? await api.put(`/hankkeet/${data.hankeTunnus}`, requestData)
      : await api.post(`/hankkeet`, requestData);

    return response.data as HankeDataDraft;
  }
);
