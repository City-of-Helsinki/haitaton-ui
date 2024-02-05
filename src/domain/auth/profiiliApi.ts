import api from '../api/api';
import { ProfiiliNimi } from './types';

export async function getProfiiliNimi(): Promise<ProfiiliNimi> {
  const verifiedName = sessionStorage.getItem('verified-name');
  if (verifiedName) {
    return JSON.parse(verifiedName as string);
  } else {
    const response = await api.get<ProfiiliNimi>('/profiili/verified-name');
    sessionStorage.setItem('verified-name', JSON.stringify(response.data));
    return response.data;
  }
}
