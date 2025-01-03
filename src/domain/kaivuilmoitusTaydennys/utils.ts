import { cloneDeep } from 'lodash';
import { Taydennys } from '../application/taydennys/types';
import { KaivuilmoitusAlue, KaivuilmoitusData } from '../application/types/application';
import { mapToKaivuilmoitusArea } from '../kaivuilmoitus/utils';

export function convertTaydennysDataToFormState(taydennys: Taydennys<KaivuilmoitusData>) {
  const data = cloneDeep(taydennys);
  data.applicationData.areas = (data.applicationData.areas as KaivuilmoitusAlue[]).map(
    mapToKaivuilmoitusArea,
  );
  return data;
}
