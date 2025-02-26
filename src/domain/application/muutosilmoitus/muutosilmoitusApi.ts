import api from '../../api/api';
import { Muutosilmoitus } from './types';

/**
 * Create muutosilmoitus
 * @param id application id
 */
export async function createMuutosilmoitus<ApplicationData>(id: number) {
  const response = await api.post<Muutosilmoitus<ApplicationData>>(
    `/hakemukset/${id}/muutosilmoitus`,
  );
  return response.data;
}

/**
 * Update muutosilmoitus
 * @param id muutosilmoitus id
 */
export async function updateMuutosilmoitus<ApplicationData, UpdateData>({
  id,
  data,
}: {
  id: string;
  data: UpdateData;
}) {
  const response = await api.put<Muutosilmoitus<ApplicationData>>(`/muutosilmoitukset/${id}`, data);
  return response.data;
}
