import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../common/utils/api';
import { HankeGeometryApiResponseData, HankeGeometryApiRequestData } from './types';

type SaveGeometryArguments = {
  hankeId: string;
  geometryData: HankeGeometryApiRequestData;
};

export const saveGeometryData = createAsyncThunk(
  'map/saveGeometry',
  async ({ hankeId, geometryData }: SaveGeometryArguments) => {
    const response = await api.post(`/hankkeet/${hankeId}/geometriat`, geometryData);

    // eslint-disable-next-line
    console.log({ geometryData, response });

    return response.data as HankeGeometryApiResponseData;
  }
);
