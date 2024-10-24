import { cloneDeep } from 'lodash';
import { Taydennys } from '../application/taydennys/types';
import { JohtoselvitysData } from '../application/types/application';
import { mapToJohtoselvitysArea } from '../johtoselvitys/utils';

export function convertTaydennysDataToFormState(taydennys: Taydennys<JohtoselvitysData>) {
  const data = cloneDeep(taydennys);
  data.applicationData.areas = data.applicationData.areas.map(mapToJohtoselvitysArea);
  return data;
}
