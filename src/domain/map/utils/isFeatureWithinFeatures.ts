import { FeatureLike } from 'ol/Feature';
import { Polygon } from 'ol/geom';
import { Feature } from 'geojson';
import booleanContains from '@turf/boolean-contains';
import { polygon as turfPolygon } from '@turf/helpers';

/**
 * Check if feature is completely contained within any of the features given as second argument
 */
export default function isFeatureWithinFeatures(featureToCheck: Feature, features: FeatureLike[]) {
  if (features.length === 0) {
    return false;
  }
  return features.some((feature) => {
    const polygon = turfPolygon((feature.getGeometry() as Polygon).getCoordinates());
    return booleanContains(polygon, featureToCheck);
  });
}
