import { useQuery } from 'react-query';
import api from '../../api/api';
import { PublicHanke } from '../../types/hanke';

export function usePublicHanke(hankeTunnus: string | null) {
  return useQuery(
    ['publicHanke', hankeTunnus],
    () => api.get<PublicHanke>(`/public-hankkeet/${hankeTunnus}`).then((res) => res.data),
    {
      enabled: !!hankeTunnus,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  );
}
