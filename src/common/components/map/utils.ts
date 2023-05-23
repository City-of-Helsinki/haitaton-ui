import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import { getArea } from 'ol/sphere';
import Geometry from 'ol/geom/Geometry';

// https://dev.hel.fi/maps
proj4.defs(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
register(proj4);

export const projection = getProjection('EPSG:3879');
projection.setExtent([25440000, 6630000, 25571072, 6761072]);

export function getSurfaceArea(geometry: Geometry) {
  return getArea(geometry, { projection });
}
