import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import { polygon } from '@turf/helpers';
import kinks from '@turf/kinks';

// https://dev.hel.fi/maps
proj4.defs(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
);
register(proj4);

export const projection = getProjection('EPSG:3879');
projection?.setExtent([25440000, 6630000, 25571072, 6761072]);

export function getSurfaceArea(geometry: Geometry) {
  if (geometry.getType() == 'Polygon') {
    return (geometry as Polygon).getArea();
  } else {
    return NaN;
  }
}

/**
 * Check if polygon is self-intersecting
 */
export function isPolygonSelfIntersecting(polygonToCheck: Polygon): boolean {
  try {
    const turfPolygon = polygon(polygonToCheck.getCoordinates());
    const selfIntersectionPoints = kinks(turfPolygon);
    return selfIntersectionPoints.features.length > 0;
  } catch (error) {
    return false;
  }
}
