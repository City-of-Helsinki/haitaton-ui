import { HankeDataDraft, HankeContact, FORMFIELD } from './types';

const isContactEmpty = ({ etunimi, sukunimi, email }: HankeContact) =>
  etunimi === '' && sukunimi === '' && email === '';

// This is temporary solution for sending empty contacts to API
export const filterEmptyContacts = (hankeData: HankeDataDraft): HankeDataDraft => ({
  ...hankeData,
  [FORMFIELD.OMISTAJAT]: hankeData[FORMFIELD.OMISTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.ARVIOIJAT]: hankeData[FORMFIELD.ARVIOIJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.TOTEUTTAJAT]:
    hankeData[FORMFIELD.TOTEUTTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
});
