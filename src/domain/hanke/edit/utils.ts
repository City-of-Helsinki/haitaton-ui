import { FORMFIELD, HANKE_VAIHE, HankeDataDraft } from './types';

export const combineObj = (obj1: HankeDataDraft, obj2: HankeDataDraft): HankeDataDraft => {
  const basicData = {
    [FORMFIELD.TUNNUS]: '',
    [FORMFIELD.NIMI]: '',
    [FORMFIELD.VAIHE]: HANKE_VAIHE.OHJELMOINTI,
  };
  return { ...basicData, ...obj1, ...obj2 };
};
