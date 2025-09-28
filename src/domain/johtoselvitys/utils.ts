import { cloneDeep } from 'lodash';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import {
  Application,
  ApplicationArea,
  ApplicationGeometry,
  ApplicationUpdateCustomerWithContacts,
  JohtoselvitysData,
  JohtoselvitysUpdateData,
} from '../application/types/application';
import { JohtoselvitysArea, JohtoselvitysFormValues } from './types';
import { JohtoselvitysTaydennysFormValues } from '../johtoselvitysTaydennys/types';

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
export function convertFormStateToJohtoselvitysUpdateData(
  formState: JohtoselvitysFormValues | JohtoselvitysTaydennysFormValues,
): JohtoselvitysUpdateData {
  // eslint-disable-next-line no-param-reassign
  delete formState.geometriesChanged;
  // eslint-disable-next-line no-param-reassign
  delete formState.selfIntersectingPolygon;

  const applicationData: JohtoselvitysUpdateData = cloneDeep(formState.applicationData);

  applicationData.areas = formState.applicationData.areas.map(function mapToApplicationArea({
    geometry,
    feature,
  }): ApplicationArea {
    const coordinates = feature
      ? (feature.getGeometry() as Polygon).getCoordinates()
      : geometry.coordinates;

    return {
      name: '',
      geometry: new ApplicationGeometry(coordinates),
    };
  });

  applicationData.customerWithContacts = ApplicationUpdateCustomerWithContacts.Create(
    formState.applicationData.customerWithContacts,
  );
  applicationData.contractorWithContacts = ApplicationUpdateCustomerWithContacts.Create(
    formState.applicationData.contractorWithContacts,
  );
  applicationData.propertyDeveloperWithContacts = ApplicationUpdateCustomerWithContacts.Create(
    formState.applicationData.propertyDeveloperWithContacts,
  );
  applicationData.representativeWithContacts = ApplicationUpdateCustomerWithContacts.Create(
    formState.applicationData.representativeWithContacts,
  );

  return applicationData;
}

export function mapToJohtoselvitysArea({ geometry }: ApplicationArea): JohtoselvitysArea {
  return {
    geometry,
    feature: new Feature(new Polygon(geometry.coordinates)),
  };
}

export function convertApplicationDataToFormState(
  application: Application<JohtoselvitysData> | undefined,
): JohtoselvitysFormValues | undefined {
  if (application === undefined) {
    return undefined;
  }

  const data = cloneDeep(application);

  data.applicationData.areas = application.applicationData.areas.map(mapToJohtoselvitysArea);

  return data;
}
