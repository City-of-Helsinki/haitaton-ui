import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import { polygon } from '@turf/helpers';
import kinks from '@turf/kinks';
import { Coordinate } from 'ol/coordinate';

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
 * Calculate if two lines intersect and return true if they do
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function linesIntersect(
  line1start: [number, number],
  line1end: [number, number],
  line2start: [number, number],
  Line2end: [number, number],
): boolean {
  // orientation of 3 coordinates
  const orientation = (a: [number, number], b: [number, number], c: [number, number]) => {
    const val = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);
    if (val === 0) return 0; // colinear
    return val > 0 ? 1 : 2; // clockwise or counterclockwise
  };

  const o1 = orientation(line1start, line1end, line2start);
  const o2 = orientation(line1start, line1end, Line2end);
  const o3 = orientation(line2start, Line2end, line1start);
  const o4 = orientation(line2start, Line2end, line1end);

  if (o1 !== o2 && o3 !== o4) return true;

  return false; // No intersections
}

/**
 * The Open layers Polygon has coordinates in circle, expand each edge to individual lines
 * @param coordinates
 */
export function getLinesFromCoordinates(coordinates: Coordinate[][]): Array<Array<Coordinate>> {
  const edgeCoordsList: Array<Array<Coordinate>> = [];
  for (let i = 0; i < coordinates[0].length - 1; i++) {
    // Take adjoining point to form lines
    edgeCoordsList.push([coordinates[0][i], coordinates[0][i + 1]]);
  }
  return edgeCoordsList;
}

export function getCoordinateNumbersFromCoordinate(coordinate: Coordinate): [number, number] {
  return [coordinate[0], coordinate[1]];
}

/**
 * Calculate if two lines intersect and get intersection point if they do
 * @param coordinates
 */
export function getLineIntersection(
  line1start: [number, number],
  line1end: [number, number],
  line2start: [number, number],
  line2end: [number, number],
): [number, number] | null {
  const s1_x = line1end[0] - line1start[0];
  const s1_y = line1end[1] - line1start[1];
  const s2_x = line2end[0] - line2start[0];
  const s2_y = line2end[1] - line2start[1];

  const denom = -s2_x * s1_y + s1_x * s2_y;
  if (denom === 0) {
    // Lines are parallel or coincident
    return null;
  }

  const s =
    (-s1_y * (line1start[0] - line2start[0]) + s1_x * (line1start[1] - line2start[1])) / denom;
  const t =
    (s2_x * (line1start[1] - line2start[1]) - s2_y * (line1start[0] - line2start[0])) / denom;

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Intersection detected within the segments
    return [line1start[0] + t * s1_x, line1start[1] + t * s1_y];
  }

  // No intersection within the segments
  return null;
}

/**
 * Check if the latest line is intersecting with previous lines in polygon
 * @param coordinates
 */
export function areLinesInPolygonIntersecting(coordinates: Coordinate[][]): boolean {
  const lines: Array<Array<Coordinate>> = getLinesFromCoordinates(coordinates);
  let result: boolean = false;
  const number_of_lines_in_polygon = lines.length;
  // To check if lines in a polygon are intersecting we need to check from the 3rd line on
  if (number_of_lines_in_polygon > 2) {
    const latest_line: Array<Coordinate> = lines[number_of_lines_in_polygon - 1];
    const latest_line_start: [number, number] = getCoordinateNumbersFromCoordinate(latest_line[0]);
    const latest_line_end: [number, number] = getCoordinateNumbersFromCoordinate(latest_line[1]);
    // if the first coordinate and last coordinate is the same we are ending the polygon
    // thus not intersecting
    if (coordinates[0][0] !== latest_line[1]) {
      // Check that the latest inserted line does not intersect with other lines
      // The previous line before the latest cannot intersect with it, so do not check that
      // break on first intersection
      for (let i = 0; i < number_of_lines_in_polygon - 2 && !result; i++) {
        const current_line_start: [number, number] = getCoordinateNumbersFromCoordinate(
          lines[i][0],
        );
        const current_line_end: [number, number] = getCoordinateNumbersFromCoordinate(lines[i][1]);
        result =
          getLineIntersection(
            current_line_start,
            current_line_end,
            latest_line_start,
            latest_line_end,
          ) != null;
      }
    }
  }
  return result;
}

/**
 * Check if polygon is self-intersecting
 */
export function isPolygonSelfIntersectingByCoordinates(coordinates: Coordinate[][]): boolean {
  try {
    const turfPolygon = polygon(coordinates);
    const selfIntersectionPoints = kinks(turfPolygon);
    return selfIntersectionPoints.features.length > 0;
  } catch (error) {
    console.log('Polygon self-intersection check error');
    return false;
  }
}

/**
 * Check if polygon is self-intersecting
 */
export function isPolygonSelfIntersecting(polygonToCheck: Polygon): boolean {
  return isPolygonSelfIntersectingByCoordinates(polygonToCheck.getCoordinates());
}
