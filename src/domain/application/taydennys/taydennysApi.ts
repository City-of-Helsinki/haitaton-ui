import api from '../../api/api';
import { Application } from '../types/application';
import { Taydennys } from './types';

/**
 * Create new taydennys
 * @param id application id
 */
export async function createTaydennys<ApplicationData>(id: string) {
  const response = await api.post<Taydennys<ApplicationData>>(`/hakemukset/${id}/taydennys`);
  return response.data;
}

/**
 * Update taydennys
 * @param id taydennys id
 */
export async function updateTaydennys<ApplicationData, UpdateData>({
  id,
  data,
}: {
  id: string;
  data: UpdateData;
}) {
  const response = await api.put<Taydennys<ApplicationData>>(`/taydennykset/${id}`, data);
  return response.data;
}

/**
 * Send taydennys to Allu
 * @param id taydennys id
 */
export async function sendTaydennys<ApplicationData>(id: string) {
  const response = await api.post<Application<ApplicationData>>(`/taydennykset/${id}/laheta`);
  return response.data;
}
