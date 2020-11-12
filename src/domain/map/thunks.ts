import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../common/utils/api';
import { HankeGeometryApiResponseData, HankeGeometryApiRequestData } from './types';

type SaveGeometryArguments = {
  hankeId: string;
  data: HankeGeometryApiRequestData;
};

export const saveGeometryData = createAsyncThunk(
  'map/saveGeometry',
  async ({ hankeId, data }: SaveGeometryArguments) => {
    const response = await api.post(`/hankkeet/${hankeId}/geometriat`, data);

    // eslint-disable-next-line
    console.log({ data, hankeId, response });

    return response.data as HankeGeometryApiResponseData;
  }
);
