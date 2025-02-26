import { Muutosilmoitus } from '../muutosilmoitus/types';
import { Taydennys } from '../taydennys/types';
import { JohtoselvitysData, KaivuilmoitusData } from '../types/application';
import { modifyKaivuilmoitusDataAfterReceive } from '../utils';

export function modifyHakemusAfterReceive(
  data:
    | Taydennys<JohtoselvitysData | KaivuilmoitusData>
    | Muutosilmoitus<JohtoselvitysData | KaivuilmoitusData>,
) {
  if (data.applicationData.applicationType === 'CABLE_REPORT') {
    return data;
  }
  const kaivuilmoitusData = modifyKaivuilmoitusDataAfterReceive(
    data.applicationData as KaivuilmoitusData,
  );
  return {
    ...data,
    applicationData: kaivuilmoitusData,
  };
}
