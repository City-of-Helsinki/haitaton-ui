import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/utils/api';
import { HankeData } from './types';

type SaveGeometryArguments = {
  data: HankeData;
};
export const saveFormData = createAsyncThunk(
  'map/saveGeometry',
  async ({ data }: SaveGeometryArguments) => {
    console.log('data2', data);
    const response = await api.post(`/hankkeet/`, data);

    // eslint-disable-next-line

    return response.data;
  }
);
