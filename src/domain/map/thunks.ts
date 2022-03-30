import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReducerState, HankeGeometryApiRequestData, HankeGeometryApiResponseData } from './types';
import api from '../api/api';

type SaveGeometryArguments = {
  hankeTunnus: string;
};

export const saveGeometryData = createAsyncThunk(
  'map/saveGeometry',
  async ({ hankeTunnus }: SaveGeometryArguments, thunkAPI) => {
    const { map } = thunkAPI.getState() as { map: ReducerState };

    if (map.drawGeometry) {
      const requestData: HankeGeometryApiRequestData = {
        featureCollection: map.drawGeometry,
      };

      const response = await api.post<HankeGeometryApiResponseData>(
        `/hankkeet/${hankeTunnus}/geometriat`,
        requestData
      );

      return response.data;
    }
    return null;
  }
);
