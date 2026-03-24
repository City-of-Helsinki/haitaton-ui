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

export function linesIntersect(
  line1start: [number, number],
  line1end: [number, number],
  line2start: [number, number],
  line2end: [number, number],
): boolean {
  // orientation of 3 coordinates
  const orientation = (a: [number, number], b: [number, number], c: [number, number]) => {
    const val = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);
    if (val === 0) return 0; // colinear
    return val > 0 ? 1 : 2; // clockwise or counterclockwise
  };

  const o1 = orientation(line1start, line1end, line2start);
  const o2 = orientation(line1start, line1end, line2end);
  const o3 = orientation(line2start, line2end, line1start);
  const o4 = orientation(line2start, line2end, line1end);

  return o1 !== o2 && o3 !== o4;
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

// Provide line intersection earlier so helpers can reference it
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
  if (denom === 0) return null;
  const s =
    (-s1_y * (line1start[0] - line2start[0]) + s1_x * (line1start[1] - line2start[1])) / denom;
  const t =
    (s2_x * (line1start[1] - line2start[1]) - s2_y * (line1start[0] - line2start[0])) / denom;
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return [line1start[0] + t * s1_x, line1start[1] + t * s1_y];
  }
  return null;
}

// Helper: convert an edge (two coordinates) into numeric endpoints
export function numericEdge(edge: [Coordinate, Coordinate]): [[number, number], [number, number]] {
  return [getCoordinateNumbersFromCoordinate(edge[0]), getCoordinateNumbersFromCoordinate(edge[1])];
}

// Helper: check if intersection point matches any endpoint in list exactly
export function isIntersectionAtAnyEndpoint(
  intersection: [number, number],
  endpoints: Array<[number, number]>,
): boolean {
  return endpoints.some(([x, y]) => intersection[0] === x && intersection[1] === y);
}

// Helper: compute line intersection and classify if it's an invalid interior crossing
// allowSharedEndpoints=true will treat endpoint-only intersections as acceptable
export function hasInvalidInteriorIntersection(
  aStart: [number, number],
  aEnd: [number, number],
  bStart: [number, number],
  bEnd: [number, number],
  allowSharedEndpoints: boolean,
): boolean {
  const intersection = getLineIntersection(aStart, aEnd, bStart, bEnd);
  if (!intersection) return false;
  if (allowSharedEndpoints) {
    if (isIntersectionAtAnyEndpoint(intersection, [aStart, aEnd, bStart, bEnd])) {
      return false; // shared endpoint only
    }
  }
  return true; // interior crossing
}

// Helper: derive candidate validation segment (latest or closing)
export function getCandidateSegmentForValidation(
  coordinates: Coordinate[][],
  lines: Array<[Coordinate, Coordinate]>,
): { segment: [[number, number], [number, number]]; isClosed: boolean; latestIndex: number } {
  const first = getCoordinateNumbersFromCoordinate(coordinates[0][0]);
  const last = getCoordinateNumbersFromCoordinate(coordinates[0][coordinates[0].length - 1]);
  const isClosed = first[0] === last[0] && first[1] === last[1];
  const latestIndex = lines.length - 1;
  if (isClosed) {
    const penultimate = getCoordinateNumbersFromCoordinate(
      coordinates[0][coordinates[0].length - 2],
    );
    return { segment: [penultimate, first], isClosed, latestIndex };
  }
  const latest = lines[latestIndex];
  return {
    segment: [
      getCoordinateNumbersFromCoordinate(latest[0]),
      getCoordinateNumbersFromCoordinate(latest[1]),
    ],
    isClosed,
    latestIndex,
  };
}

/**
 * Calculate if two lines intersect and get intersection point if they do
 * @param coordinates
 */

/**
 * Check if the latest line is intersecting with previous lines in polygon
 * @param coordinates
 */
function validateClosedPolygon(lines: Array<[Coordinate, Coordinate]>): boolean {
  const lastIndex = lines.length - 1;
  for (let i = 0; i < lines.length; i++) {
    const [aStart, aEnd] = numericEdge(lines[i]);
    for (let j = i + 1; j < lines.length; j++) {
      const isAdjacent = j === i + 1 || (i === 0 && j === lastIndex);
      if (isAdjacent) continue;
      const [bStart, bEnd] = numericEdge(lines[j]);
      if (hasInvalidInteriorIntersection(aStart, aEnd, bStart, bEnd, true)) return true;
    }
  }
  return false;
}

function validateIncrementalSegment(
  lines: Array<[Coordinate, Coordinate]>,
  segStart: [number, number],
  segEnd: [number, number],
): boolean {
  const lastIndex = lines.length - 1;
  for (let i = 0; i < lastIndex; i++) {
    if (i === lastIndex - 1) continue; // skip adjacent previous edge
    const [currStart, currEnd] = numericEdge(lines[i]);
    if (hasInvalidInteriorIntersection(currStart, currEnd, segStart, segEnd, true)) return true;
  }
  return false;
}

export function areLinesInPolygonIntersecting(coordinates: Coordinate[][]): boolean {
  const lines = getLinesFromCoordinates(coordinates) as Array<[Coordinate, Coordinate]>;
  if (lines.length <= 2) return false;
  const { segment, isClosed } = getCandidateSegmentForValidation(coordinates, lines);
  const [segStart, segEnd] = segment;
  return isClosed
    ? validateClosedPolygon(lines)
    : validateIncrementalSegment(lines, segStart, segEnd);
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
    // Log and treat invalid geometry as non self-intersecting to keep draw flow resilient

    console.warn('turf kinks error (treated as non-intersecting):', error);
    return false;
  }
}

/**
 * Check if polygon is self-intersecting
 */
export function isPolygonSelfIntersecting(polygonToCheck: Polygon): boolean {
  return isPolygonSelfIntersectingByCoordinates(polygonToCheck.getCoordinates());
}

/**
 * Check if a drawing segment is within hanke area boundaries
 * @param map OpenLayers map instance
 * @param latestLine Segment coordinates [start, end]
 * @param hankeLayerFilter Function to identify hanke layers
 * @returns true if segment is within boundaries, false otherwise
 */
export function isSegmentWithinHankeArea(
  map: import('ol').Map,
  latestLine: [Coordinate, Coordinate],
  hankeLayerFilter: (layer: import('ol/layer').Layer<import('ol/source').Source>) => boolean,
): boolean {
  const endPixel = map.getPixelFromCoordinate(latestLine[1]);
  const hankeFeatures = map.getFeaturesAtPixel(endPixel, { layerFilter: hankeLayerFilter });

  // If no hanke feature is under the cursor, disallow
  if (!hankeFeatures || hankeFeatures.length === 0) return false;

  // Use the topmost hanke polygon under cursor
  const hankeGeom = (hankeFeatures[0] as import('ol').Feature<Polygon>)?.getGeometry();
  if (!hankeGeom) return false;

  const edges = getLinesFromCoordinates(hankeGeom.getCoordinates());
  const [sx, sy] = getCoordinateNumbersFromCoordinate(latestLine[0]);
  const [ex, ey] = getCoordinateNumbersFromCoordinate(latestLine[1]);

  const eps = 1e-6;
  const almost = (a: number, b: number) => Math.abs(a - b) < eps;

  for (const edge of edges) {
    const [aStart, aEnd] = numericEdge(edge as [Coordinate, Coordinate]);
    const cross = getLineIntersection([sx, sy], [ex, ey], aStart, aEnd);
    if (cross) {
      // treat almost-equal endpoints as shared endpoints
      const endpointMatches =
        (almost(cross[0], sx) && almost(cross[1], sy)) ||
        (almost(cross[0], ex) && almost(cross[1], ey)) ||
        (almost(cross[0], aStart[0]) && almost(cross[1], aStart[1])) ||
        (almost(cross[0], aEnd[0]) && almost(cross[1], aEnd[1]));
      if (!endpointMatches) {
        return false;
      }
    }
  }
  return true;
}
