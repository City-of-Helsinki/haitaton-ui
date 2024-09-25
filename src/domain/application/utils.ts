import { TFunction } from 'i18next';
import api from '../api/api';
import {
  AlluStatus,
  AlluStatusStrings,
  Application,
  ApplicationDeletionResult,
  ApplicationType,
  JohtoselvitysData,
  JohtoselvitysUpdateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
  NewJohtoselvitysData,
  Paatos,
  PaatosTila,
  PaatosTyyppi,
  ReportOperationalConditionData,
} from './types/application';
import { SignedInUser } from '../hanke/hankeUsers/hankeUser';
import { HIDDEN_FIELD_VALUE } from './constants';
import { cloneDeep } from 'lodash';

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
 * Report application in operational condition
 */
export async function reportOperationalCondition(data: ReportOperationalConditionData) {
  await api.post<Application>(`/hakemukset/${data.applicationId}/toiminnallinen-kunto`, {
    date: data.date,
  });
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

export function isApplicationReportableInOperationalCondition(
  applicationType: ApplicationType,
  alluStatus: AlluStatusStrings | null,
) {
  return (
    applicationType === 'EXCAVATION_NOTIFICATION' &&
    (alluStatus === AlluStatus.PENDING ||
      alluStatus === AlluStatus.HANDLING ||
      alluStatus === AlluStatus.INFORMATION_RECEIVED ||
      alluStatus === AlluStatus.RETURNED_TO_PREPARATION ||
      alluStatus === AlluStatus.DECISIONMAKING ||
      alluStatus === AlluStatus.DECISION)
  );
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

export function getCurrentDecisions(paatokset?: { [key: string]: Paatos[] }): Paatos[] {
  if (!paatokset) {
    return [];
  }
  const allDecisions = Object.values(paatokset).flat();
  const order = {
    [PaatosTyyppi.TYO_VALMIS]: 1,
    [PaatosTyyppi.TOIMINNALLINEN_KUNTO]: 2,
    [PaatosTyyppi.PAATOS]: 3,
  };
  const currentOrders = allDecisions.filter((paatos) => paatos.tila === PaatosTila.NYKYINEN);
  currentOrders.sort((a, b) => order[a.tyyppi] - order[b.tyyppi]);
  return currentOrders;
}

export function getDecisionFilename(paatos: Paatos): string {
  return `${paatos.hakemustunnus}-${paatos.tyyppi.toLowerCase().replace('_', '-')}.pdf`;
}

export function modifyDataBeforeSend<T extends JohtoselvitysUpdateData | KaivuilmoitusUpdateData>(
  applicationData: T,
): T {
  if (applicationData.applicationType === 'CABLE_REPORT') {
    return applicationData;
  }
  if (
    applicationData.customerWithContacts?.customer?.type === 'PERSON' ||
    applicationData.customerWithContacts?.customer?.type === 'OTHER'
  ) {
    const modifiedApplicationData = cloneDeep<T>(applicationData);
    if (
      modifiedApplicationData?.customerWithContacts?.customer.registryKey === HIDDEN_FIELD_VALUE
    ) {
      modifiedApplicationData.customerWithContacts.customer.registryKey = null;
      modifiedApplicationData.customerWithContacts.customer.registryKeyHidden = true;
    } else if (modifiedApplicationData?.customerWithContacts?.customer.registryKey === '') {
      modifiedApplicationData.customerWithContacts.customer.registryKey = null;
      modifiedApplicationData.customerWithContacts.customer.registryKeyHidden = false;
    }
    return modifiedApplicationData;
  }
  return applicationData;
}

export function modifyDataAfterReceive<T extends JohtoselvitysData | KaivuilmoitusData>(
  application: Application<T>,
): Application<T> {
  if (application.applicationType === 'CABLE_REPORT') {
    return application;
  }
  if (
    (application.applicationData.customerWithContacts?.customer?.type === 'PERSON' ||
      application.applicationData.customerWithContacts?.customer?.type === 'OTHER') &&
    application.applicationData.customerWithContacts?.customer?.registryKeyHidden
  ) {
    const modifiedApplicationData = cloneDeep<T>(application.applicationData);
    modifiedApplicationData.customerWithContacts!.customer.registryKey = HIDDEN_FIELD_VALUE;
    return {
      ...application,
      applicationData: modifiedApplicationData,
    };
  }
  return application;
}
