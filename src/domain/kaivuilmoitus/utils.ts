import { cloneDeep, omitBy } from 'lodash';
import {
  Application,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../application/types/application';
import { KaivuilmoitusFormValues } from './types';

/**
 * Convert kaivuilmoitus form state to application update data.
 */
export function convertFormStateToKaivuilmoitusUpdateData(
  formState: KaivuilmoitusFormValues,
): KaivuilmoitusUpdateData {
  const applicationData: KaivuilmoitusUpdateData = cloneDeep(formState.applicationData);
  return applicationData;
}

/**
 * Convert application data coming from backend to form state.
 */
export function convertApplicationDataToFormState(
  application: Application<KaivuilmoitusData> | undefined,
): KaivuilmoitusFormValues | undefined {
  if (application === undefined) {
    return undefined;
  }

  const data = cloneDeep(application);

  // Remove null values from application data
  data.applicationData = omitBy(
    data.applicationData,
    (value) => value === null,
  ) as KaivuilmoitusData;

  return data;
}
