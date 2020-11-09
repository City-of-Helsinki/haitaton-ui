import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../common/utils/api';
// import { HankeGeometry } from './types';

type SaveGeometryArgs = {
  hankeId: string;
  geometryData: any;
};

export const saveGeometryData = createAsyncThunk(
  'map/saveGeometry',
  async ({ hankeId, geometryData }: SaveGeometryArgs) => {
    const response = await api.post(`/api/projects/${hankeId}`, geometryData);

    console.log({ geometryData });

    return (await response.data) as any;
  }
);
