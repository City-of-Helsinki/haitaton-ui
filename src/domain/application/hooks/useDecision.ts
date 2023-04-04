import { useEffect } from 'react';
import { useQuery } from 'react-query';
import api from '../../api/api';
import { AlluStatus, AlluStatusStrings } from '../types/application';

async function getDecision(id: number | null): Promise<string> {
  const { data } = await api.get<Blob>(`hakemukset/${id}/paatos`, { responseType: 'blob' });
  return URL.createObjectURL(data);
}

export function useDecision(id: number | null, status: AlluStatusStrings | null) {
  const result = useQuery<string>(['decision', id], () => getDecision(id), {
    enabled: Boolean(id) && status === AlluStatus.DECISION,
  });

  useEffect(() => {
    return function cleanup() {
      if (result.data) {
        URL.revokeObjectURL(result.data);
      }
    };
  }, [result.data]);

  return result;
}
