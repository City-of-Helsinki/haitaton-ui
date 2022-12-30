import { useQuery } from 'react-query';
import api from '../../api/api';
import { HankeDataDraft } from '../../types/hanke';

async function getHanke(hankeTunnus?: string) {
  const { data } = await api.get<HankeDataDraft>(`/hankkeet/${hankeTunnus}`);
  return data;
}

export default function useHanke(hankeTunnus?: string) {
  return useQuery<HankeDataDraft>(['hanke', hankeTunnus], () => getHanke(hankeTunnus), {
    enabled: !!hankeTunnus,
  });
}
