import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/utils/api';

interface MyData {
  name: string;
}

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const saveGeometryData = createAsyncThunk('map/saveGeometry', async (userId: number) => {
  const response = await api.get(`/api/projects/${userId}`);

  return (await response.data) as MyData;
});
