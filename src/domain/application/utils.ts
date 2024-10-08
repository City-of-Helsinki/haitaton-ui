import { TFunction } from 'i18next';
import api from '../api/api';
import {
  AlluStatus,
  AlluStatusStrings,
  Application,
  ApplicationDeletionResult,
  JohtoselvitysData,
  KaivuilmoitusData,
  NewJohtoselvitysData,
} from './types/application';
import { SignedInUser } from '../hanke/hankeUsers/hankeUser';

/**
 * Create new johtoselvitys without hanke being created first
 */
export async function createJohtoselvitys(data: NewJohtoselvitysData) {
  const response = await api.post<Application>('johtoselvityshakemus', data);
  return response.data;
}

/**
 * Create new application
 */
export async function createApplication<ApplicationData, CreateData>(data: CreateData) {
  const response = await api.post<Application<ApplicationData>>('/hakemukset', data);
  return response.data;
}

/**
 * Update application
 */
export async function updateApplication<ApplicationData, UpdateData>({
  id,
  data,
}: {
  id: number;
  data: UpdateData;
}) {
  const response = await api.put<Application<ApplicationData>>(`/hakemukset/${id}`, data);
  return response.data;
}

/**
 * Send application to Allu
 */
export async function sendApplication(applicationId: number) {
  const response = await api.post<Application>(`/hakemukset/${applicationId}/laheta`, {});
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

/**
 * Check if application is in cancelled state
 */
export function isApplicationCancelled(alluStatus: AlluStatusStrings | null): boolean {
  return alluStatus === AlluStatus.CANCELLED;
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

/**
 * Check if the user is a contact person in an application.
 */
export function isContactIn(
  signedInUser?: SignedInUser,
  applicationData?: JohtoselvitysData | KaivuilmoitusData,
) {
  if (signedInUser && applicationData) {
    const found = [
      applicationData.customerWithContacts,
      applicationData.contractorWithContacts,
      applicationData.propertyDeveloperWithContacts,
      applicationData.representativeWithContacts,
    ]
      .flatMap((customer) => customer?.contacts)
      .find((contact) => contact?.hankekayttajaId === signedInUser.hankeKayttajaId);
    return found !== undefined;
  }
  return false;
}
