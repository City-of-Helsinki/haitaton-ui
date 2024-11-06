import { useQuery } from 'react-query';
import api from '../../api/api';
import { HankkeenHakemus } from '../types/application';

async function getApplicationsForHanke(hankeTunnus?: string, includeAreas: boolean = false) {
  const requestUrl = `/hankkeet/${hankeTunnus}/hakemukset${includeAreas ? '?areas=true' : ''}`;
  const { data } = await api.get<{ applications: HankkeenHakemus[] }>(requestUrl);
  return data;
}

export function useApplicationsForHanke(hankeTunnus?: string, includeAreas: boolean = false) {
  return useQuery<{ applications: HankkeenHakemus[] }>(
    ['applicationsForHanke', hankeTunnus],
    () => getApplicationsForHanke(hankeTunnus, includeAreas),
    { enabled: Boolean(hankeTunnus) },
  );
}
