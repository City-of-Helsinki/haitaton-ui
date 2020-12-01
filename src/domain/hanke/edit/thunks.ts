import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/utils/api';
import { HankeDataDraft, HANKE_SAVETYPE_KEY } from './types';

type SaveHankeData = {
  data: HankeDataDraft;
  saveType: HANKE_SAVETYPE_KEY;
};

export const saveForm = createAsyncThunk(
  'form/saveData',
  async ({ data, saveType }: SaveHankeData) => {
    const requestData = {
      ...data,
      saveType,
      createdBy: '1',
    };

    let responseData: HankeDataDraft | null;

    if (data.hankeTunnus) {
      responseData = await api.put(`/hankkeet/${data.hankeTunnus}`, requestData);
    } else {
      responseData = await api.post(`/hankkeet`, requestData);
    }

    return responseData;
  }
);
