import { useQuery } from 'react-query';
import api from '../../api/api';
import { HankkeenHakemus } from '../types/application';

async function getApplicationsForHanke(hankeTunnus?: string) {
  const { data } = await api.get<{ applications: HankkeenHakemus[] }>(
    `/hankkeet/${hankeTunnus}/hakemukset`,
  );
  return data;
}
export function useApplicationsForHanke(hankeTunnus?: string) {
  return useQuery<{ applications: HankkeenHakemus[] }>(
    ['applicationsForHanke', hankeTunnus],
    () => getApplicationsForHanke(hankeTunnus),
    { enabled: Boolean(hankeTunnus) },
  );
}
