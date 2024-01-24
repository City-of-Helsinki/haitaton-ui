import api from '../../api/api';
import { HankeDataFormState, NewHankeData } from './types';
import { convertFormStateToHankeData } from './utils';

export async function createHanke(data: NewHankeData) {
  const response = await api.post<HankeDataFormState>('hankkeet', data);
  return response.data;
}

export async function updateHanke(data: HankeDataFormState) {
  const requestData = {
    ...convertFormStateToHankeData(data),
  };
  const response = await api.put<HankeDataFormState>(`/hankkeet/${data.hankeTunnus}`, requestData);
  return response.data;
}
