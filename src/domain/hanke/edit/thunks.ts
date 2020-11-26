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
    const response = await api.post(`/hankkeet/`, { ...data, saveType, createdBy: '1' });
    return response.data;
  }
);
