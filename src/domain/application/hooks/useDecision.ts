import { useQuery } from 'react-query';
import api from '../../api/api';
import { AlluStatus, AlluStatusStrings } from '../types/application';

async function getDecision(id: number | null): Promise<string> {
  const { data } = await api.get<Blob>(`hakemukset/${id}/paatos`, { responseType: 'blob' });
  return URL.createObjectURL(data);
}

export function useDecision(id: number | null, status: AlluStatusStrings | null) {
  return useQuery<string>(['decision', id], () => getDecision(id), {
    enabled: Boolean(id) && status === AlluStatus.DECISION,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}
