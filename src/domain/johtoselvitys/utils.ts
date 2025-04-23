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
import { HankeAlue } from '../types/hanke';
import {
  featureContainsApplicationGeometry,
  getFeatureFromHankeGeometry,
  olFeatureToGeoJSON,
} from '../map/utils';

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

function getHankealueContainingJohtoselvitysArea(
  johtoselvitysArea: JohtoselvitysArea,
  hankeAreas: HankeAlue[],
): HankeAlue | undefined {
  return hankeAreas.find((area) => {
    const olFeature = area.geometriat && getFeatureFromHankeGeometry(area.geometriat);
    const geoJsonFeature = olFeatureToGeoJSON(olFeature);
    return (
      geoJsonFeature &&
      featureContainsApplicationGeometry(geoJsonFeature, johtoselvitysArea.geometry)
    );
  });
}

/**
 * Get johtoselvitys areas grouped by hanke area. This can be used in places where johtoselvitys areas need to be grouped by the hanke area where they are located.
 *
 * @param applicationAreas
 * @param hankeAreas
 */
export function getAreasGroupedByHankeArea(
  applicationAreas: JohtoselvitysArea[],
  hankeAreas: HankeAlue[],
): Record<string, JohtoselvitysArea[]> {
  const areasByHanke = {} as Record<string, JohtoselvitysArea[]>;
  applicationAreas.forEach((area) => {
    const hankeArea = getHankealueContainingJohtoselvitysArea(area, hankeAreas);
    const id = hankeArea?.id?.toString();
    if (id) {
      if (!areasByHanke[id]) {
        areasByHanke[id] = [];
      }
      areasByHanke[id].push(area);
    }
  });
  return areasByHanke;
}

export const length = (rec: Record<string, ApplicationArea[]>) => Object.keys(rec).length;
export const isEmpty = (rec: Record<string, ApplicationArea[]>) => length(rec) === 0;
