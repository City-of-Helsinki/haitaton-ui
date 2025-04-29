import api from '../../api/api';
import { Muutosilmoitus } from './types';
import { Application, PaperDecisionReceiver } from '../types/application';

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
 * @param data updated data
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

/**
 * Send muutosilmoitus to Allu
 */
export async function sendMuutosilmoitus(
  id: string,
  paperDecisionReceiver: PaperDecisionReceiver | null | undefined,
) {
  const response = await api.post<Application>(
    `/muutosilmoitukset/${id}/laheta`,
    paperDecisionReceiver
      ? {
          paperDecisionReceiver: paperDecisionReceiver,
        }
      : null,
  );
  return response.data;
}

/**
 * Delete muutosilmoitus
 */
export async function cancelMuutosilmoitus(id: string) {
  await api.delete(`/muutosilmoitukset/${id}`);
}
