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
