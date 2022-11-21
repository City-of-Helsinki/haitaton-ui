import { HankeContact, HankeDataDraft } from '../../types/hanke';
import { FORMFIELD, HankeDataFormState } from './types';
import { formatFeaturesToHankeGeoJSON } from '../../map/utils';

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

export const convertHankeAlueGeometries = (hankeData: HankeDataFormState): HankeDataFormState => ({
  ...hankeData,
  [FORMFIELD.HANKEALUEET]: hankeData[FORMFIELD.HANKEALUEET]?.map((alue) => {
    return {
      ...alue,
      geometria: { featureCollection: formatFeaturesToHankeGeoJSON([alue.feature]) },
    };
  }),
});

export const convertHankeDataToFormState = (
  hankeData: HankeDataDraft | undefined
): HankeDataFormState => ({
  ...hankeData,
  omistajat: hankeData?.omistajat ? hankeData.omistajat : [],
  arvioijat: hankeData?.arvioijat ? hankeData.arvioijat : [],
  toteuttajat: hankeData?.toteuttajat ? hankeData.toteuttajat : [],
});
