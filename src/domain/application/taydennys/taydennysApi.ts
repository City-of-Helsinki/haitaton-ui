import api from '../../api/api';
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
