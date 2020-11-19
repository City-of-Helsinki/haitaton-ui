import { HANKE_VAIHE, HankeDataDraft } from './types';

export function combineObj(obj1: HankeDataDraft, obj2: HankeDataDraft | null) {
  const basicData = {
    hankeId: '',
    nimi: '',
    vaihe: HANKE_VAIHE.OHJELMOINTI,
  };
  return { ...basicData, ...obj1, ...obj2 };
}
