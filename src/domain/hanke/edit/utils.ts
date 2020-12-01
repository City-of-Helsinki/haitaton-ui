import { HankeDataDraft } from './types';

export const combineObj = (obj1: HankeDataDraft, obj2: HankeDataDraft): HankeDataDraft => ({
  ...obj1,
  ...obj2,
});
