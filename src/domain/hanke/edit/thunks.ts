import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/utils/api';
import { HankeDataDraft } from './types';

type SaveHankeData = {
  data: HankeDataDraft;
};

export const saveForm = createAsyncThunk('form/saveData', async ({ data }: SaveHankeData) => {
  const response = await api.post(`/hankkeet/`, data);
  return response.data;
});
