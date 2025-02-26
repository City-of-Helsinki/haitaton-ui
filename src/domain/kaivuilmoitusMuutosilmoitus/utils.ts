import { cloneDeep } from 'lodash';
import { Muutosilmoitus } from '../application/muutosilmoitus/types';
import { KaivuilmoitusData } from '../application/types/application';
import { mapToKaivuilmoitusArea } from '../kaivuilmoitus/utils';

export function convertMuutosilmoitusDataToFormState(
  muutosilmoitus: Muutosilmoitus<KaivuilmoitusData>,
) {
  const data = cloneDeep(muutosilmoitus);
  data.applicationData.areas = data.applicationData.areas.map(mapToKaivuilmoitusArea);
  return data;
}
