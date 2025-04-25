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

/**
 * Function to check if the area is new i.e. if changes include `areas[${index}]` but not any subfields
 *
 * @param index - The index of the area
 * @param muutokset - The list of changes
 */
export function isNewArea(index: number, muutokset: string[]) {
  return (
    muutokset.includes(`areas[${index}]`) &&
    !muutokset.some((item) => item.startsWith(`areas[${index}].`))
  );
}
