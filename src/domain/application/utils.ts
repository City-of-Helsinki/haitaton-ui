import { TFunction } from 'i18next';
import api from '../api/api';
import {
  AlluStatus,
  AlluStatusStrings,
  Application,
  ApplicationDeletionResult,
} from './types/application';

/**
 * Save application to Haitaton backend
 */
export async function saveApplication(data: Application) {
  // If there is no hankeTunnus when creating new cable report application
  // call /hakemukset/luo-hanke endpoint, so that hanke is generated in the backend
  const postUrl: string =
    data.hankeTunnus === null && data.applicationType === 'CABLE_REPORT'
      ? '/hakemukset/johtoselvitys'
      : '/hakemukset';

  const response = data.id
    ? await api.put<Application>(`/hakemukset/${data.id}`, data)
    : await api.post<Application>(postUrl, data);

  return response.data;
}

/**
 * Send application to Allu
 */
export async function sendApplication(applicationId: number) {
  const response = await api.post<Application>(`/hakemukset/${applicationId}/send-application`, {});
  return response.data;
}

/**
 * Check if application is sent to Allu
 */
export function isApplicationSent(alluStatus: AlluStatusStrings | null): boolean {
  return alluStatus !== null;
}

/**
 * Check if application is pending or in draft state, meaning it's not
 * yet being handled in Allu
 */
export function isApplicationPending(alluStatus: AlluStatusStrings | null): boolean {
  return (
    alluStatus === null ||
    alluStatus === AlluStatus.PENDING_CLIENT ||
    alluStatus === AlluStatus.PENDING
  );
}

export function isApplicationDraft(alluStatus: AlluStatus | null) {
  return alluStatus === null;
}

export async function cancelApplication(applicationId: number | null) {
  if (applicationId === null) return null;

  const response = await api.delete<ApplicationDeletionResult>(`/hakemukset/${applicationId}`);
  return response.data;
}

export function getAreaDefaultName(t: TFunction, index: number | undefined, areasLength: number) {
  const label = t('hakemus:labels:workArea');
  if (areasLength > 1 && index !== undefined) return `${label} ${index + 1}`;
  return label;
}
