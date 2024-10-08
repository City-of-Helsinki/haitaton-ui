import { useQuery } from 'react-query';
import api from '../../api/api';
import { Application } from '../types/application';
import { modifyDataAfterReceive } from '../utils';

async function getApplication(id?: number) {
  const { data } = await api.get<Application>(`/hakemukset/${id}`);
  return data;
}

export function useApplication(id?: number) {
  return useQuery<Application>(['application', id], () => getApplication(id), {
    enabled: Boolean(id),
    select: modifyDataAfterReceive,
  });
}
