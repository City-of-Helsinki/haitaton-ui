import { cloneDeep, omitBy } from 'lodash';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import {
  Application,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
  Tyoalue,
} from '../application/types/application';
import { KaivuilmoitusFormValues } from './types';

/**
 * Convert kaivuilmoitus form state to application update data.
 */
export function convertFormStateToKaivuilmoitusUpdateData(
  formState: KaivuilmoitusFormValues,
): KaivuilmoitusUpdateData {
  const applicationData: KaivuilmoitusUpdateData = cloneDeep(formState.applicationData);

  const updatedAreas = formState.applicationData.areas.map((area) => {
    return {
      ...area,
      tyoalueet: area.tyoalueet.map((tyoalue) => {
        // Exclude openlayers feature object from tyoalue
        // after updating tyoalue geometry from openlayers feature
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { openlayersFeature, ...alue } = new Tyoalue(tyoalue.openlayersFeature!);
        return alue;
      }),
    };
  });
  applicationData.areas = updatedAreas;

  return applicationData;
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
  const updatedAreas = data.applicationData.areas.map((area) => {
    return {
      ...area,
      tyoalueet: area.tyoalueet.map((tyoalue) => {
        return {
          ...tyoalue,
          openlayersFeature: new Feature(new Polygon(tyoalue.geometry.coordinates)),
        };
      }),
    };
  });
  data.applicationData.areas = updatedAreas;

  // Remove null values from application data
  data.applicationData = omitBy(
    data.applicationData,
    (value) => value === null,
  ) as KaivuilmoitusData;

  return data;
}
