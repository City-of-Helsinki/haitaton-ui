import { HankeData } from './types';

export function combineObj(obj1: HankeData, obj2: HankeData | null) {
  let basicData = {
    hankeId: '',
    name: '',
    owner: '',
    phase: 1,
  };
  basicData = { ...basicData, ...obj1 };
  return { ...basicData, ...obj2 };
}
