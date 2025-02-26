import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import { Feature as GeoJSONFeature, Polygon as GeoJSONPolygon } from 'geojson';
import { max, min } from 'date-fns';
import { ValidationError } from 'yup';
import { Link } from 'hds-react';
import { FieldPath, UseFormGetValues } from 'react-hook-form';
import { HankeAlue, HankeYhteystieto, HankeDataDraft, HankeMuuTaho } from '../../types/hanke';
import {
  FORMFIELD,
  HankeAlueFormState,
  HankeDataFormState,
  HankePostData,
  HankePostMuuTaho,
  HankePostYhteystieto,
} from './types';
import {
  featureContains,
  formatFeaturesToHankeGeoJSON,
  getFeatureFromHankeGeometry,
} from '../../map/utils';
import { getSurfaceArea } from '../../../common/components/map/utils';
import {
  ApplicationArea,
  HankkeenHakemus,
  KaivuilmoitusAlue,
  Tyoalue,
} from '../../application/types/application';
import { isApplicationCancelled, isApplicationPending } from '../../application/utils';
import { TFunction } from 'i18next';
import booleanContains from '@turf/boolean-contains';
import { feature } from '@turf/helpers';

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
      const feat =
        currArea.feature ||
        (currArea.geometriat && getFeatureFromHankeGeometry(currArea.geometriat));

      if (!feat) return surfaceArea;
      const geom = feat.getGeometry();
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
 * Maps yup validation error to a list item.
 */
export function mapValidationErrorToErrorListItem(
  error: ValidationError,
  t: TFunction,
  getValues: UseFormGetValues<HankeDataFormState>,
) {
  const errorPath = error.path?.replace('[', '.').replace(']', '');
  // Get parts of the path: for example for path 'alueet.0.meluHaitta' returns ['alueet', '0', 'meluHaitta'],
  // and for example for 'alueet' just ['alueet']
  const pathParts = errorPath?.match(/(\w+)/g) || [];

  if (pathParts.length === 1 && pathParts[0] === 'alueet') {
    pathParts[0] = 'alueet.empty';
  }

  const langKey = pathParts.reduce((acc, part, index) => {
    if (index === 1) {
      // Exclude the index from the lang key
      return acc;
    }
    return `${acc}:${part}`;
  }, 'hankeForm:missingFields');

  const linkText = t(langKey, {
    count: Number(pathParts[1]) + 1,
    alueName: getValues(`alueet.${pathParts[1]}.nimi` as FieldPath<HankeDataFormState>),
  });

  return (
    <li key={errorPath}>
      <Link href={`#${errorPath}`} disableVisitedStyles>
        {linkText}
      </Link>
    </li>
  );
}

/**
 * Returns hakemukset that are inside hankealue
 */
export function getApplicationsInsideHankealue(
  hankeAlue: HankeAlue,
  applications: HankkeenHakemus[],
): HankkeenHakemus[] {
  if (applications.length === 0) {
    return [];
  }
  const hankeFeature = hankeAlue.geometriat?.featureCollection.features[0];
  if (!hankeFeature) {
    return [];
  }
  const johtoselvitysApplications = applications.filter(
    (hakemus) => hakemus.applicationType == 'CABLE_REPORT',
  );
  const kaivuilmoitusApplications = applications.filter(
    (hakemus) => hakemus.applicationType == 'EXCAVATION_NOTIFICATION',
  );
  const johtoselvitysApplicationInsideHankealue: HankkeenHakemus[] =
    johtoselvitysApplications.filter((hakemus) =>
      ((hakemus.applicationData.areas || []) as ApplicationArea[]).some(
        (area) => area.geometry && booleanContains(hankeFeature, area.geometry),
      ),
    );
  const kaivuilmoitusApplicationInsideHankealue: HankkeenHakemus[] =
    kaivuilmoitusApplications.filter((hakemus) =>
      ((hakemus.applicationData.areas || []) as KaivuilmoitusAlue[])
        .flatMap((area) => area.tyoalueet)
        .some((area) => area.geometry && booleanContains(hankeFeature, area.geometry)),
    );
  return [...johtoselvitysApplicationInsideHankealue, ...kaivuilmoitusApplicationInsideHankealue];
}

/**
 * Returns work areas that are inside hankealue feature
 */
export function getWorkAreasInsideHankealueFeature(
  hankeFeature: GeoJSONFeature<GeoJSONPolygon>,
  applications: HankkeenHakemus[],
): (ApplicationArea | Tyoalue)[] {
  if (applications.length === 0) {
    return [];
  }
  const johtoselvitysApplications = applications.filter(
    (hakemus) => hakemus.applicationType == 'CABLE_REPORT',
  );
  const kaivuilmoitusApplications = applications.filter(
    (hakemus) => hakemus.applicationType == 'EXCAVATION_NOTIFICATION',
  );
  const johtoselvitysWorkAreasInsideHankealue: ApplicationArea[] = johtoselvitysApplications
    .flatMap((hakemus) => (hakemus.applicationData.areas || []) as ApplicationArea[])
    .filter((area) => featureContains(hankeFeature, feature(area.geometry)));
  const kaivuilmoitusWorkAreasInsideHankealue: Tyoalue[] = kaivuilmoitusApplications
    .flatMap((hakemus) => (hakemus.applicationData.areas || []) as KaivuilmoitusAlue[])
    .flatMap((area) => area.tyoalueet)
    .filter((area) => area.geometry && featureContains(hankeFeature, feature(area.geometry)));
  return [...johtoselvitysWorkAreasInsideHankealue, ...kaivuilmoitusWorkAreasInsideHankealue];
}

export type DateLimits = [maxStartDate: Date | null, minEndDate: Date | null];

/**
 * Returns valid date limits for hankealue so that the maximum start date is the earliest start date of hakemukset and the minimum end date is the latest end date of hakemukset.
 */
export function getHankealueDateLimits(
  haittaAlkuPvm: Date | null,
  hakemukset: HankkeenHakemus[],
): DateLimits {
  const { hakemusStartDates, hakemusEndDates } = hakemukset.reduce(
    (acc, hakemus) => {
      const startTime = hakemus.applicationData.startTime;
      const endTime = hakemus.applicationData.endTime;

      if (startTime !== null && endTime !== null) {
        acc.hakemusStartDates.push(startTime);
        acc.hakemusEndDates.push(endTime);
      }
      return acc;
    },
    { hakemusStartDates: [] as Date[], hakemusEndDates: [] as Date[] },
  );
  if (hakemusStartDates.length === 0 || hakemusEndDates.length === 0) {
    return [null, haittaAlkuPvm && new Date(haittaAlkuPvm)];
  }
  return [min(hakemusStartDates), max(hakemusEndDates)];
}
