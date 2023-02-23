import { cloneDeep, findKey } from 'lodash';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import {
  Application,
  ApplicationArea,
  ApplicationGeometry,
  CustomerType,
  isCustomerWithContacts,
  JohtoselvitysData,
} from '../application/types/application';
import { JohtoselvitysArea, JohtoselvitysFormValues } from './types';

/**
 * Find the contact key that has orderer field true
 */
export function findOrdererKey(data: JohtoselvitysData): CustomerType {
  const ordererRole = findKey(data, (value) => {
    if (isCustomerWithContacts(value)) {
      return value.contacts[0]?.orderer;
    }
    return false;
  });

  return ordererRole as CustomerType;
}

export function getAreaGeometry(area: JohtoselvitysArea): Geometry {
  if (area.feature) {
    const featureGeometry = area.feature.getGeometry();
    if (featureGeometry) {
      return featureGeometry;
    }
  }
  return new Polygon(area.geometry.coordinates);
}

export function getAreaGeometries(areas: JohtoselvitysArea[]) {
  return areas.map(getAreaGeometry);
}

/**
 * Convert cable report application form state to application data.
 * Make sure that each areas geometry coordinates are updated to
 * latest OpenLayers feature coordinates.
 */
export function convertFormStateToApplicationData(formState: JohtoselvitysFormValues): Application {
  const data: Application = cloneDeep(formState);

  const updatedAreas: ApplicationArea[] = formState.applicationData.areas.map(
    function mapToApplicationArea({ name, geometry, feature }): ApplicationArea {
      const coordinates = feature
        ? (feature.getGeometry() as Polygon).getCoordinates()
        : geometry.coordinates;

      return {
        name,
        geometry: new ApplicationGeometry(coordinates),
      };
    }
  );

  data.applicationData.areas = updatedAreas;

  return data;
}
