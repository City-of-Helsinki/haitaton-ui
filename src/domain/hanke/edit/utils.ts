import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import { Polygon as GeoJSONPolygon } from 'geojson';
import { max, min } from 'date-fns';
import { HankeAlue, HankeContact, HankeDataDraft, HankeMuuTaho } from '../../types/hanke';
import { FORMFIELD, HankeAlueFormState, HankeDataFormState } from './types';
import { formatFeaturesToHankeGeoJSON, getFeatureFromHankeGeometry } from '../../map/utils';
import { getSurfaceArea } from '../../../common/components/map/utils';
import { Application } from '../../application/types/application';
import { isApplicationPending } from '../../application/utils';

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
  return {
    ...hankeData,
    [FORMFIELD.HANKEALUEET]: hankeData[FORMFIELD.HANKEALUEET]?.map((alue) => {
      // eslint-disable-next-line
      const { feature, ...hankeAlue } = alue; // exclude virtual field 'feature' from API call
      return {
        ...hankeAlue,
        geometriat: {
          featureCollection: formatFeaturesToHankeGeoJSON(alue.feature ? [alue.feature] : []),
        },
      };
    }),
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
  hankeData: HankeDataDraft | undefined,
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
        nimi: alue.nimi !== null && alue.nimi !== '' ? alue.nimi : undefined,
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

/**
 * Check if it is possible to cancel hanke
 */
export function canHankeBeCancelled(applications: Application[]): boolean {
  return applications.every((application) => isApplicationPending(application.alluStatus));
}

const defaultNameRegExp = /^Hankealue (\d+)$/;

/**
 * Get default name for hanke area
 */
export function getAreaDefaultName(areas?: HankeAlueFormState[]) {
  if (areas === undefined) {
    return undefined;
  }

  function getAreaNumber(area?: HankeAlueFormState): number {
    const areaNumber = area?.nimi?.match(defaultNameRegExp);
    return areaNumber ? Number(areaNumber[1]) : 0;
  }

  const maxAreaNumber = areas.map(getAreaNumber).reduce((a, b) => Math.max(a, b), 0);

  return `Hankealue ${maxAreaNumber + 1}`;
}
