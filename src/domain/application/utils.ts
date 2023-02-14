import api from '../api/api';
import { Application } from './types/application';

/**
 * Save application to Haitaton backend
 */
export async function saveApplication(data: Application) {
  const response = data.id
    ? await api.put<Application>(`/hakemukset/${data.id}`, data)
    : await api.post<Application>('/hakemukset', data);

  return response.data;
}

/**
 * Send application to Allu
 */
export async function sendApplication(applicationId: number) {
  const response = await api.post<Application>(`/hakemukset/${applicationId}/send-application`, {});
  return response.data;
}
