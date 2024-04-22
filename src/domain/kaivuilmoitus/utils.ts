import { cloneDeep } from 'lodash';
import { KaivuilmoitusUpdateData } from '../application/types/application';
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
