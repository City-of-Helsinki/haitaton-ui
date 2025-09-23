import { FeatureLike } from 'ol/Feature';
import { Polygon } from 'ol/geom';
import { Feature } from 'geojson';
import booleanContains from '@turf/boolean-contains';
import { polygon as turfPolygon } from '@turf/helpers';
import { featureContains } from '../utils';

/**
 * Check if feature is completely contained within any of the features given as second argument
 */
export default function isFeatureWithinFeatures(featureToCheck: Feature, features: FeatureLike[]) {
  if (features.length === 0) {
    return false;
  }
  const typeToCheck = featureToCheck.geometry.type;
  const polygonToCheck =
    typeToCheck === 'Polygon' ? turfPolygon(featureToCheck.geometry.coordinates) : undefined;
  return features.some((feature) => {
    const polygon = turfPolygon((feature.getGeometry() as Polygon).getCoordinates());

    if (typeToCheck === 'Polygon') {
      return featureContains(polygon, polygonToCheck!);
    } else {
      return booleanContains(polygon, featureToCheck);
    }
  });
}
