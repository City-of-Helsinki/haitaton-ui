import { TFunction } from 'i18next';
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

export function getAreaDefaultName(t: TFunction, index: number) {
  const label = t('hakemus:labels:workArea');
  if (index > 0) return `${label} ${index + 1}`;
  return label;
}