import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../common/utils/api';
import { HankeGeometryApiResponseData, HankeGeometryApiRequestData } from './types';

type SaveGeometryArguments = {
  hankeTunnus: string;
  data: HankeGeometryApiRequestData;
};

export const saveGeometryData = createAsyncThunk(
  'map/saveGeometry',
  async ({ hankeTunnus, data }: SaveGeometryArguments) => {
    const response = await api.post(`/hankkeet/${hankeTunnus}/geometriat`, data);

    // eslint-disable-next-line
    console.log({ data, hankeTunnus, response });

    return response.data as HankeGeometryApiResponseData;
  }
);
