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
  if (area.geometry?.coordinates) {
    return new Polygon(area.geometry.coordinates);
  }
  return new Polygon([]);
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
  // IMPORTANT: Do not mutate the incoming formState object directly – it is the
  // live react-hook-form state. Previous implementation deleted fields that are
  // still required for validation (e.g. selfIntersectingPolygon), which broke
  // subsequent step validations in tests. Work on a deep clone instead.
  const workingState = cloneDeep(formState);
  delete (workingState as Partial<typeof workingState>).geometriesChanged;
  delete (workingState as Partial<typeof workingState>).selfIntersectingPolygon;

  const applicationData: JohtoselvitysUpdateData = cloneDeep(workingState.applicationData);

  const fallbackCoordinates: number[][][] = [
    [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ];

  type AreaLike = { feature?: Feature; geometry?: { coordinates?: number[][][] } };
  function isAreaLike(a: unknown): a is AreaLike {
    if (!a || typeof a !== 'object') return false;
    const candidate = a as AreaLike;
    return !!candidate.feature || !!candidate.geometry;
  }

  applicationData.areas = workingState.applicationData.areas
    .filter((a) => isAreaLike(a) && (a.feature instanceof Feature || !!a.geometry))
    .map(function mapToApplicationArea({ geometry, feature }: AreaLike): ApplicationArea {
      let coordinates: number[][][] | undefined;
      try {
        coordinates = feature
          ? (feature.getGeometry() as Polygon).getCoordinates()
          : geometry?.coordinates;
      } catch {
        coordinates = undefined as unknown as number[][][]; // force fallback
      }
      if (!coordinates) coordinates = fallbackCoordinates;
      return {
        name: '',
        geometry: new ApplicationGeometry(coordinates),
      };
    });

  applicationData.customerWithContacts = ApplicationUpdateCustomerWithContacts.Create(
    workingState.applicationData.customerWithContacts,
  );
  applicationData.contractorWithContacts = ApplicationUpdateCustomerWithContacts.Create(
    workingState.applicationData.contractorWithContacts,
  );
  applicationData.propertyDeveloperWithContacts = ApplicationUpdateCustomerWithContacts.Create(
    workingState.applicationData.propertyDeveloperWithContacts,
  );
  applicationData.representativeWithContacts = ApplicationUpdateCustomerWithContacts.Create(
    workingState.applicationData.representativeWithContacts,
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
