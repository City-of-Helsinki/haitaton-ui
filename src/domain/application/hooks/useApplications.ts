import { useQuery } from 'react-query';
import api from '../../api/api';
import { Application } from '../types/application';

async function getApplications() {
  const { data } = await api.get<Application[]>(`/hakemukset`);
  return data;
}

async function getApplicationsForHanke(hankeTunnus?: string) {
  const { data } = await api.get<{ applications: Application[] }>(
    `/hankkeet/${hankeTunnus}/hakemukset`
  );
  return data;
}

export function useApplications() {
  return useQuery<Application[]>(['applications'], getApplications);
}

export function useApplicationsForHanke(hankeTunnus?: string) {
  return useQuery<{ applications: Application[] }>(
    ['applicationsForHanke'],
    () => getApplicationsForHanke(hankeTunnus),
    { enabled: Boolean(hankeTunnus) }
  );
}
