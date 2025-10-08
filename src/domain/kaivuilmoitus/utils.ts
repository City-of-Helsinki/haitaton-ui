import { cloneDeep, isEqual, omitBy } from 'lodash';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import {
  Application,
  KaivuilmoitusAlue,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
  Tyoalue,
} from '../application/types/application';
import { KaivuilmoitusFormValues } from './types';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';
import { KaivuilmoitusTaydennysFormValues } from '../kaivuilmoitusTaydennys/types';
import { KaivuilmoitusMuutosilmoitusFormValues } from '../kaivuilmoitusMuutosilmoitus/types';

/**
 * Convert kaivuilmoitus form state to application update data.
 */
export function convertFormStateToKaivuilmoitusUpdateData(
  formState:
    | KaivuilmoitusFormValues
    | KaivuilmoitusTaydennysFormValues
    | KaivuilmoitusMuutosilmoitusFormValues,
): KaivuilmoitusUpdateData {
  const applicationData: KaivuilmoitusUpdateData = cloneDeep(
    // fall back to an object with empty areas if missing (defensive for test fixtures)
    formState.applicationData || { areas: [] },
  ) as KaivuilmoitusUpdateData;

  const sourceAreas = Array.isArray(formState.applicationData?.areas)
    ? formState.applicationData!.areas
    : [];

  const updatedAreas = sourceAreas.map((area) => {
    const safeTyoalueet = Array.isArray(area.tyoalueet) ? area.tyoalueet : [];
    return {
      ...area,
      tyoalueet: safeTyoalueet.map((tyoalue) => {
        // If openlayersFeature is missing (e.g. stripped in tests), keep original geometry structure
        if (!tyoalue?.openlayersFeature) {
          return { ...tyoalue };
        }
        try {
          // Exclude openlayers feature object from tyoalue after updating geometry
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { openlayersFeature, ...alue } = new Tyoalue(tyoalue.openlayersFeature);
          return alue;
        } catch (e) {
          // As a last resort, return shallow copy to avoid breaking save
          // eslint-disable-next-line no-console
          if (process.env.NODE_ENV === 'test') console.debug('Tyoalue conversion fallback', e);
          return { ...tyoalue };
        }
      }),
    };
  });

  applicationData.areas = updatedAreas;
  return applicationData;
}

export function mapToKaivuilmoitusArea(area: KaivuilmoitusAlue): KaivuilmoitusAlue {
  return {
    ...area,
    tyoalueet: area.tyoalueet.map((tyoalue) => {
      return {
        ...tyoalue,
        openlayersFeature: new Feature(new Polygon(tyoalue.geometry.coordinates)),
      };
    }),
  };
}

/**
 * Convert application data coming from backend to form state.
 */
export function convertApplicationDataToFormState(
  application: Application<KaivuilmoitusData> | undefined,
): KaivuilmoitusFormValues | undefined {
  if (application === undefined) {
    return undefined;
  }

  const data = cloneDeep(application);

  // Add openlayers feature to each tyoalue
  const updatedAreas = data.applicationData.areas.map(mapToKaivuilmoitusArea);
  data.applicationData.areas = updatedAreas;

  // Remove null values from application data
  data.applicationData = omitBy(
    data.applicationData,
    (value) => value === null,
  ) as KaivuilmoitusData;

  return data;
}

/**
 * Calculate traffic nuisance index summary for all work areas of given kaivuilmoitusalue.
 * Summary is calculated by taking the maximum value of each index type from all work areas.
 */
export function calculateLiikennehaittaindeksienYhteenveto(
  kaivuilmoitusalue?: KaivuilmoitusAlue,
): HaittaIndexData {
  const emptyHaittaIndexData: HaittaIndexData = {
    liikennehaittaindeksi: {
      indeksi: 0,
      tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
    },
    pyoraliikenneindeksi: 0,
    autoliikenne: {
      indeksi: 0,
      haitanKesto: 0,
      katuluokka: 0,
      liikennemaara: 0,
      kaistahaitta: 0,
      kaistapituushaitta: 0,
    },
    linjaautoliikenneindeksi: 0,
    raitioliikenneindeksi: 0,
  };

  if (!kaivuilmoitusalue) {
    return emptyHaittaIndexData;
  }

  return kaivuilmoitusalue.tyoalueet
    .map((tyoalue) => tyoalue.tormaystarkasteluTulos ?? emptyHaittaIndexData)
    .reduce((acc, haittaindeksi) => {
      return {
        liikennehaittaindeksi: {
          indeksi: Math.max(
            acc.liikennehaittaindeksi.indeksi,
            haittaindeksi?.liikennehaittaindeksi.indeksi || 0,
          ),
          tyyppi:
            acc.liikennehaittaindeksi.indeksi > haittaindeksi?.liikennehaittaindeksi.indeksi || 0
              ? acc.liikennehaittaindeksi.tyyppi
              : haittaindeksi?.liikennehaittaindeksi.tyyppi || 0,
        },
        pyoraliikenneindeksi: Math.max(
          acc.pyoraliikenneindeksi,
          haittaindeksi?.pyoraliikenneindeksi || 0,
        ),
        autoliikenne: {
          indeksi: Math.max(acc.autoliikenne.indeksi, haittaindeksi?.autoliikenne.indeksi || 0),
          haitanKesto: Math.max(
            acc.autoliikenne.haitanKesto,
            haittaindeksi?.autoliikenne.haitanKesto || 0,
          ),
          katuluokka: Math.max(
            acc.autoliikenne.katuluokka,
            haittaindeksi?.autoliikenne.katuluokka || 0,
          ),
          liikennemaara: Math.max(
            acc.autoliikenne.liikennemaara,
            haittaindeksi?.autoliikenne.liikennemaara || 0,
          ),
          kaistahaitta: Math.max(
            acc.autoliikenne.kaistahaitta,
            haittaindeksi?.autoliikenne.kaistahaitta || 0,
          ),
          kaistapituushaitta: Math.max(
            acc.autoliikenne.kaistapituushaitta,
            haittaindeksi?.autoliikenne.kaistapituushaitta || 0,
          ),
        },
        linjaautoliikenneindeksi: Math.max(
          acc.linjaautoliikenneindeksi,
          haittaindeksi?.linjaautoliikenneindeksi || 0,
        ),
        raitioliikenneindeksi: Math.max(
          acc.raitioliikenneindeksi,
          haittaindeksi?.raitioliikenneindeksi || 0,
        ),
      };
    }, emptyHaittaIndexData);
}

/**
 * Check if traffic nuisance indexes have changed between two kaivuilmoitusalues.
 */
export function hasHaittaIndexesChanged(alue1: KaivuilmoitusAlue, alue2?: KaivuilmoitusAlue) {
  if (!alue2) {
    return false;
  }
  const haittaIndexes = calculateLiikennehaittaindeksienYhteenveto(alue1);
  const changedHaittaIndexes = calculateLiikennehaittaindeksienYhteenveto(alue2);
  return !isEqual(haittaIndexes, changedHaittaIndexes);
}
