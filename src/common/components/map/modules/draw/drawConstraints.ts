import Polygon from 'ol/geom/Polygon';
import { Map } from 'ol';
import { Draw } from 'ol/interaction';
import { DrawSegmentGuard } from './types';
import { areLinesInPolygonIntersecting } from '../../utils';

// Types
export type Ring = number[][];

// Returns number of committed user points excluding cursor + closing point
export function getActualPointCount(coordinates: number[][][]): number {
  return coordinates[0].length - 2;
}

export function isCursorMovement(newCount: number, lastCount: number): boolean {
  return newCount <= lastCount;
}

export function getSegmentPoints(
  ring: Ring,
  pointCount: number,
): { start?: number[]; end?: number[] } {
  if (pointCount < 2) return {};
  return {
    start: ring[pointCount - 2],
    end: ring[pointCount - 1],
  };
}

export function legacyGuardViolated(
  map: Map,
  guard: DrawSegmentGuard,
  start: number[],
  end: number[],
): boolean {
  return !guard(map, [start, end]);
}

export function polygonContainsSegment(
  poly: Polygon,
  start: number[],
  end: number[],
  midpointSteps = 5,
): boolean {
  // End point must be inside
  if (!poly.intersectsCoordinate(end)) return false;
  // Midpoint sampling
  for (let i = 1; i < midpointSteps; i += 1) {
    const f = i / midpointSteps;
    const mid: number[] = [start[0] + (end[0] - start[0]) * f, start[1] + (end[1] - start[1]) * f];
    if (!poly.intersectsCoordinate(mid)) return false;
  }
  return true;
}

export function selfIntersectionDetected(ring: Ring): boolean {
  // committed ring excludes cursor + closing first point
  const committedCount = ring.length - 2;
  const committedRing = [...ring.slice(0, committedCount)];
  if (committedRing.length < 3) return false;
  return areLinesInPolygonIntersecting([committedRing]);
}

export function rejectLastPoint(
  draw: Draw,
  notificationKind: 'selfIntersecting' | 'outsideArea',
  showConstraintNotification: (kind: 'selfIntersecting' | 'outsideArea') => void,
  currentPointCount: number,
): number {
  try {
    draw.removeLastPoint();
  } catch {
    /* ignore */
  }
  showConstraintNotification(notificationKind);
  return currentPointCount - 1;
}
