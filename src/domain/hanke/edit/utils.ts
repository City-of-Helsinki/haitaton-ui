import { isBefore, parseISO } from 'date-fns';
import { HankeContact, HankeDataDraft } from '../../types/hanke';
import { FORMFIELD, HankeDataFormState } from './types';

const isContactEmpty = ({
  etunimi,
  sukunimi,
  email,
  puhelinnumero,
  organisaatioNimi,
}: HankeContact) =>
  etunimi === '' &&
  sukunimi === '' &&
  email === '' &&
  puhelinnumero === '' &&
  organisaatioNimi === '';

// This is temporary solution for sending empty contacts to API
export const filterEmptyContacts = (hankeData: HankeDataFormState): HankeDataFormState => ({
  ...hankeData,
  [FORMFIELD.OMISTAJAT]: hankeData[FORMFIELD.OMISTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.ARVIOIJAT]: hankeData[FORMFIELD.ARVIOIJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.TOTEUTTAJAT]:
    hankeData[FORMFIELD.TOTEUTTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
});

export const convertHankeDataToFormState = (
  hankeData: HankeDataDraft | undefined
): HankeDataFormState => ({
  ...hankeData,
  omistajat: hankeData?.omistajat ? hankeData.omistajat : [],
  arvioijat: hankeData?.arvioijat ? hankeData.arvioijat : [],
  toteuttajat: hankeData?.toteuttajat ? hankeData.toteuttajat : [],
});

export const isHankeEditingDisabled = ({ alkuPvm }: HankeDataDraft | HankeDataFormState) => {
  if (alkuPvm && isBefore(parseISO(alkuPvm), new Date())) {
    return 'STARTED';
  }

  return false;
};
