import { useQuery } from 'react-query';
import api from '../../api/api';
import { Application } from '../types/application';

async function getApplications() {
  const { data } = await api.get<Application[]>(`/hakemukset`);
  return data;
}

export function useApplications() {
  return useQuery<Application[]>(['applications'], getApplications);
}

export function useApplicationsForHanke(
  hankeTunnus?: string
): { data: Application[]; error: unknown; isLoading: boolean } {
  const { data: allApplications, error, isLoading } = useApplications();
  const applicationsForHanke = allApplications?.filter(
    (application) => application.hankeTunnus === hankeTunnus
  );
  return { data: applicationsForHanke || [], error, isLoading };
}
