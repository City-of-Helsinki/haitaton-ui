import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/utils/api';
import { HankeData } from './types';

type SaveHankeData = {
  data: HankeData;
};
export const saveForm = createAsyncThunk('form/saveData', async ({ data }: SaveHankeData) => {
  const response = await api.post(`/hankkeet/`, data);
  return response.data;
});
