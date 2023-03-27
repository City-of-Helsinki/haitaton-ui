import { useQuery } from 'react-query';
import api from '../../api/api';
import { Application } from '../types/application';

async function getApplication(id?: number) {
  const { data } = await api.get<Application>(`/hakemukset/${id}`);
  return data;
}

export function useApplication(id?: number) {
  return useQuery<Application>(['application'], () => getApplication(id), {
    enabled: Boolean(id),
  });
}
