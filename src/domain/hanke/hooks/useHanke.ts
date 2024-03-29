import { useQuery } from 'react-query';
import api from '../../api/api';
import { HankeData } from '../../types/hanke';

async function getHanke(hankeTunnus?: string | null) {
  const { data } = await api.get<HankeData>(`/hankkeet/${hankeTunnus}`);
  return data;
}

export default function useHanke(hankeTunnus?: string | null) {
  return useQuery<HankeData>(['hanke', hankeTunnus], () => getHanke(hankeTunnus), {
    enabled: !!hankeTunnus,
  });
}
