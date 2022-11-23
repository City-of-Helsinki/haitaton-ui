import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import { Polygon as GeoJSONPolygon } from 'geojson';
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

/**
 * Make sure that hanke data to be sent to API matches requirements.
 * Convert openlayers features in areas to HankeGeoJSON.
 * Filter out empty contacts (temporary solution for sending empty contacts to API).
 */
export const convertFormStateToHankeData = (hankeData: HankeDataFormState): HankeDataFormState => ({
  ...hankeData,
  [FORMFIELD.HANKEALUEET]: hankeData[FORMFIELD.HANKEALUEET]?.map((alue) => {
    return {
      ...alue,
      geometria: {
        featureCollection: formatFeaturesToHankeGeoJSON(alue.feature ? [alue.feature] : []),
      },
    };
  }),
  [FORMFIELD.OMISTAJAT]: hankeData[FORMFIELD.OMISTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.ARVIOIJAT]: hankeData[FORMFIELD.ARVIOIJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.TOTEUTTAJAT]:
    hankeData[FORMFIELD.TOTEUTTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
});

/**
 * Make sure that hanke data coming from API has everything the form needs.
 * Add openlayers feature to each hanke area, converting area geometry into openlayers feature.
 */
export const convertHankeDataToFormState = (
  hankeData: HankeDataDraft | undefined
): HankeDataFormState => ({
  ...hankeData,
  [FORMFIELD.HANKEALUEET]:
    hankeData &&
    hankeData[FORMFIELD.HANKEALUEET]?.map((alue) => {
      const geometry = alue.geometria?.featureCollection.features[0].geometry as GeoJSONPolygon;
      return {
        ...alue,
        feature: new Feature(new Polygon(geometry.coordinates)),
      };
    }),
  omistajat: hankeData?.omistajat ? hankeData.omistajat : [],
  arvioijat: hankeData?.arvioijat ? hankeData.arvioijat : [],
  toteuttajat: hankeData?.toteuttajat ? hankeData.toteuttajat : [],
});
