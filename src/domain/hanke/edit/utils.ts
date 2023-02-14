import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import { Polygon as GeoJSONPolygon } from 'geojson';
import { max, min } from 'date-fns';
import { HankeDataDraft, HankeContact, HankeMuuTaho, HankeAlue } from '../../types/hanke';
import { FORMFIELD, HankeAlueFormState, HankeDataFormState } from './types';
import { formatFeaturesToHankeGeoJSON, getFeatureFromHankeGeometry } from '../../map/utils';
import { getSurfaceArea } from '../../../common/components/map/utils';

export function getAreasMinStartDate(areas: HankeAlue[] | undefined) {
  const areaStartDates = areas?.map((alue) => {
    return new Date(alue.haittaAlkuPvm);
  });
  const minAreaStartDate = areaStartDates && min(areaStartDates);
  return minAreaStartDate;
}

export function getAreasMaxEndDate(areas: HankeAlue[] | undefined) {
  const areaEndDates = areas?.map((alue) => {
    return new Date(alue.haittaLoppuPvm);
  });
  const maxAreaEndDate = areaEndDates && max(areaEndDates);
  return maxAreaEndDate;
}

const isContactEmpty = ({ nimi, email, puhelinnumero }: HankeContact | HankeMuuTaho) =>
  nimi === '' && email === '' && puhelinnumero === '';

/**
 * Make sure that hanke data to be sent to API matches requirements.
 * Convert openlayers features in areas to HankeGeoJSON.
 * Add alkuPvm and loppuPvm based on area dates.
 * Filter out empty contacts (temporary solution for sending empty contacts to API).
 */
export const convertFormStateToHankeData = (hankeData: HankeDataFormState): HankeDataFormState => {
  const hankeAreas = hankeData[FORMFIELD.HANKEALUEET];
  const minAreaStartDate = getAreasMinStartDate(hankeAreas);
  const maxAreaEndDate = getAreasMaxEndDate(hankeAreas);

  return {
    ...hankeData,
    [FORMFIELD.HANKEALUEET]: hankeData[FORMFIELD.HANKEALUEET]?.map((alue) => {
      return {
        ...alue,
        geometriat: {
          featureCollection: formatFeaturesToHankeGeoJSON(alue.feature ? [alue.feature] : []),
        },
      };
    }),
    ...(minAreaStartDate && { alkuPvm: minAreaStartDate.toISOString() }),
    ...(maxAreaEndDate && { loppuPvm: maxAreaEndDate.toISOString() }),
    [FORMFIELD.OMISTAJAT]: hankeData[FORMFIELD.OMISTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
    [FORMFIELD.RAKENNUTTAJAT]:
      hankeData[FORMFIELD.RAKENNUTTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
    [FORMFIELD.TOTEUTTAJAT]:
      hankeData[FORMFIELD.TOTEUTTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
    [FORMFIELD.MUUTTAHOT]: hankeData[FORMFIELD.MUUTTAHOT]?.filter((v) => !isContactEmpty(v)) || [],
  };
};

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
      const geometry = alue.geometriat?.featureCollection.features[0]?.geometry as GeoJSONPolygon;
      if (!geometry) {
        return alue;
      }
      return {
        ...alue,
        feature: new Feature(new Polygon(geometry.coordinates)),
      };
    }),
  omistajat: hankeData?.omistajat ? hankeData.omistajat : [],
  rakennuttajat: hankeData?.rakennuttajat ? hankeData.rakennuttajat : [],
  toteuttajat: hankeData?.toteuttajat ? hankeData.toteuttajat : [],
  muut: hankeData?.muut ? hankeData.muut : [],
});

/**
 * Calculate total surface area of all hanke areas
 */
export function calculateTotalSurfaceArea(areas?: HankeAlueFormState[]) {
  try {
    const areasTotalSurfaceArea = areas?.reduce((surfaceArea, currArea) => {
      const feature =
        currArea.feature ||
        (currArea.geometriat && getFeatureFromHankeGeometry(currArea.geometriat));

      if (!feature) return surfaceArea;
      const geom = feature.getGeometry();
      const currAreaSurface = geom && Math.round(getSurfaceArea(geom));
      return currAreaSurface ? surfaceArea + currAreaSurface : surfaceArea;
    }, 0);

    return areasTotalSurfaceArea;
  } catch (error) {
    return null;
  }
}
