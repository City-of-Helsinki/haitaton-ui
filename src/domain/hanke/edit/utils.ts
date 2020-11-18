import { HankeData } from './types';

export function combineObj(obj1: HankeData, obj2: HankeData | null) {
  const basicData = {
    hankeId: '',
    name: '',
    owner: '',
    phase: 1,
  };
  return { ...basicData, ...obj1, ...obj2 };
}
