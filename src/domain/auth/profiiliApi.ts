import api from '../api/api';
import { ProfiiliNimi } from './types';

export async function getProfiiliNimi(): Promise<ProfiiliNimi> {
  const response = await api.get<ProfiiliNimi>('/profiili/verified-name');
  return response.data;
}
