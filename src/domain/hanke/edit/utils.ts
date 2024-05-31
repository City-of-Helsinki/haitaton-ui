import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import { Polygon as GeoJSONPolygon } from 'geojson';
import { max, min } from 'date-fns';
import {
  HankeAlue,
  HankeYhteystieto,
  HankeDataDraft,
  HankeMuuTaho,
  HankeIndexData,
  HAITTOJENHALLINTATYYPPI,
  HANKE_INDEX_TYPE,
} from '../../types/hanke';
import {
  FORMFIELD,
  HankeAlueFormState,
  HankeDataFormState,
  HankePostData,
  HankePostMuuTaho,
  HankePostYhteystieto,
} from './types';
import { formatFeaturesToHankeGeoJSON, getFeatureFromHankeGeometry } from '../../map/utils';
import { getSurfaceArea } from '../../../common/components/map/utils';
import { HankkeenHakemus } from '../../application/types/application';
import { isApplicationCancelled, isApplicationPending } from '../../application/utils';

function mapToAreaDates(areas: HankeAlue[] | undefined, key: 'haittaAlkuPvm' | 'haittaLoppuPvm') {
  return areas?.reduce((result: Date[], area) => {
    const areaTime = area[key];
    if (areaTime) {
      result.push(new Date(areaTime));
    }
    return result;
  }, []);
}

export function getAreasMinStartDate(areas: HankeAlue[] | undefined) {
  const areaStartDates = mapToAreaDates(areas, 'haittaAlkuPvm');
  const minAreaStartDate = areaStartDates && min(areaStartDates);
  return minAreaStartDate;
}

export function getAreasMaxEndDate(areas: HankeAlue[] | undefined) {
  const areaEndDates = mapToAreaDates(areas, 'haittaLoppuPvm');
  const maxAreaEndDate = areaEndDates && max(areaEndDates);
  return maxAreaEndDate;
}

const isContactEmpty = ({ nimi, email, puhelinnumero }: HankeYhteystieto | HankeMuuTaho) =>
  nimi === '' && email === '' && puhelinnumero === '';

function mapContactPersonToId(
  contact: HankeYhteystieto | HankeMuuTaho,
): HankePostYhteystieto | HankePostMuuTaho {
  const yhteyshenkilot = contact.yhteyshenkilot;
  return {
    ...contact,
    yhteyshenkilot: yhteyshenkilot ? yhteyshenkilot.map((person) => person.id) : [],
  };
}

/**
 * Make sure that hanke data to be sent to API matches requirements.
 * Convert openlayers features in areas to HankeGeoJSON.
 * Add alkuPvm and loppuPvm based on area dates.
 * Filter out empty contacts (temporary solution for sending empty contacts to API).
 */
export const convertFormStateToHankeData = (hankeData: HankeDataFormState): HankePostData => {
  return {
    ...hankeData,
    [FORMFIELD.HANKEALUEET]: hankeData[FORMFIELD.HANKEALUEET]?.map((alue) => {
      // eslint-disable-next-line
      const { feature, ...hankeAlue } = alue; // exclude virtual field 'feature' from API call
      return {
        ...hankeAlue,
        geometriat: {
          ...hankeAlue.geometriat,
          featureCollection: formatFeaturesToHankeGeoJSON(alue.feature ? [alue.feature] : []),
        },
      };
    }),
    [FORMFIELD.OMISTAJAT]: hankeData[FORMFIELD.OMISTAJAT]
      ?.filter((v) => !isContactEmpty(v))
      .map(mapContactPersonToId) as HankePostYhteystieto[],
    [FORMFIELD.RAKENNUTTAJAT]: hankeData[FORMFIELD.RAKENNUTTAJAT]
      ?.filter((v) => !isContactEmpty(v))
      .map(mapContactPersonToId) as HankePostYhteystieto[],
    [FORMFIELD.TOTEUTTAJAT]: hankeData[FORMFIELD.TOTEUTTAJAT]
      ?.filter((v) => !isContactEmpty(v))
      .map(mapContactPersonToId) as HankePostYhteystieto[],
    [FORMFIELD.MUUTTAHOT]: hankeData[FORMFIELD.MUUTTAHOT]
      ?.filter((v) => !isContactEmpty(v))
      .map(mapContactPersonToId) as HankePostMuuTaho[],
  };
};

export function convertHankeAlueToFormState(alue: HankeAlue) {
  const geometry = alue.geometriat?.featureCollection.features[0]?.geometry as GeoJSONPolygon;
  if (!geometry) {
    return alue;
  }
  return {
    ...alue,
    feature: new Feature(new Polygon(geometry.coordinates)),
    nimi: alue.nimi !== null && alue.nimi !== '' ? alue.nimi : undefined,
  };
}

/**
 * Make sure that hanke data coming from API has everything the form needs.
 * Add openlayers feature to each hanke area, converting area geometry into openlayers feature.
 */
export const convertHankeDataToFormState = (
  hankeData: HankeDataDraft | HankeDataFormState | undefined,
): HankeDataFormState => ({
  ...hankeData,
  [FORMFIELD.HANKEALUEET]:
    hankeData && hankeData[FORMFIELD.HANKEALUEET]?.map(convertHankeAlueToFormState),
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
export function canHankeBeCancelled(applications: HankkeenHakemus[]): boolean {
  return applications.every(
    (application) =>
      isApplicationPending(application.alluStatus) ||
      isApplicationCancelled(application.alluStatus),
  );
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

/**
 * Sorts HAITTOJENHALLINTATYYPPI based on given tormaystarkasteluTulos.
 * For example, if tormaystarkasteluTulos has {autoliikenneindeksi: 1.0, pyoraliiikenneindeksi: 1.3, linjaautoliikenneindeksi: 0.0, raitioliikenneindeksi: 0.0},
 * the result will be [PYORALIIKENNE, AUTOLIIKENNE, LINJAAUTOLIIKENNE, RAITIOLIIKENNE].
 */
export function sortedLiikenneHaittojenhallintatyyppi(
  tormaystarkasteluTulos: HankeIndexData | undefined,
): HAITTOJENHALLINTATYYPPI[] {
  const defaultOrder = Object.values(HAITTOJENHALLINTATYYPPI).filter(
    (type) => type !== HAITTOJENHALLINTATYYPPI.YLEINEN && type !== HAITTOJENHALLINTATYYPPI.MUUT,
  );
  if (!tormaystarkasteluTulos) {
    return defaultOrder;
  }
  const sortedIndices = Object.values(HANKE_INDEX_TYPE)
    .map((key) => ({
      type: key.toUpperCase().replace('INDEKSI', '') as HAITTOJENHALLINTATYYPPI,
      value: tormaystarkasteluTulos[key.toLowerCase() as keyof HankeIndexData] as number,
    }))
    .sort((a, b): number => {
      const diff = b.value - a.value;
      if (diff === 0) {
        return defaultOrder.indexOf(a.type) - defaultOrder.indexOf(b.type);
      }
      return diff;
    })
    .map((item) => item.type);
  return defaultOrder.sort((a, b): number => sortedIndices.indexOf(a) - sortedIndices.indexOf(b));
}
