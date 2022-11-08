import { isBefore, parseISO } from 'date-fns';
import { HankeDataDraft, HankeRakennuttaja, HankeMuuTaho } from '../../types/hanke';
import { today } from './hankeSchema';
import { FORMFIELD, HankeDataFormState } from './types';

const isContactEmpty = ({ nimi, email, puhelinnumero }: HankeRakennuttaja | HankeMuuTaho) =>
  nimi === '' && email === '' && puhelinnumero === '';

// This is temporary solution for sending empty contacts to API
export const filterEmptyContacts = (hankeData: HankeDataFormState): HankeDataFormState => ({
  ...hankeData,
  [FORMFIELD.RAKENNUTTAJAT]:
    hankeData[FORMFIELD.RAKENNUTTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.TOTEUTTAJAT]:
    hankeData[FORMFIELD.TOTEUTTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.MUUTTAHOT]: hankeData[FORMFIELD.MUUTTAHOT]?.filter((v) => !isContactEmpty(v)) || [],
});

export const convertHankeDataToFormState = (
  hankeData: HankeDataDraft | undefined
): HankeDataFormState => ({
  ...hankeData,
  rakennuttajat: hankeData?.rakennuttajat ? hankeData.rakennuttajat : [],
  toteuttajat: hankeData?.toteuttajat ? hankeData.toteuttajat : [],
  muutTahot: hankeData?.muutTahot ? hankeData.muutTahot : [],
});

export const isHankeEditingDisabled = ({ alkuPvm }: HankeDataDraft | HankeDataFormState) => {
  if (alkuPvm && isBefore(parseISO(alkuPvm), today)) {
    return 'STARTED';
  }

  return false;
};
