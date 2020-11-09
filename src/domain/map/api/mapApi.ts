import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/utils/api';

interface MyData {
  name: string;
}

export const saveGeometryData = createAsyncThunk('map/saveGeometry', async (data: string) => {
  const response = await api.get(`/api/projects/1`);
  // Inferred return type: Promise<MyData>
  return (await response.data) as MyData;
});
