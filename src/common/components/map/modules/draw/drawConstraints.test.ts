import Polygon from 'ol/geom/Polygon';
import {
  polygonContainsSegment,
  selfIntersectionDetected,
  getSegmentPoints,
} from './drawConstraints';

describe('drawConstraints helpers', () => {
  const square = new Polygon([
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
  ]);

  test('polygonContainsSegment: inside segment passes', () => {
    const start = [2, 2];
    const end = [4, 4];
    expect(polygonContainsSegment(square, start, end)).toBe(true);
  });

  test('polygonContainsSegment: segment with outside midpoint fails', () => {
    const start = [2, 2];
    const end = [12, 12]; // outside
    expect(polygonContainsSegment(square, start, end)).toBe(false);
  });

  test('selfIntersectionDetected: simple non intersecting ring false', () => {
    const ring = [
      [0, 0],
      [5, 0],
      [5, 5],
      [0, 5],
      [0, 0],
      [0, 0],
    ]; // includes closing + cursor placeholders mimic structure
    expect(selfIntersectionDetected(ring)).toBe(false);
  });

  test('selfIntersectionDetected: bow-tie intersecting ring true', () => {
    // Bow-tie / hourglass shape crossing at center (lines (0,0)->(5,5) and (5,0)->(0,5))
    // Structure during drawing: [p0,...,pn,cursor,p0]; we simulate with duplicate closing/cursor points
    const ring = [
      [0, 0],
      [5, 5],
      [5, 0],
      [0, 5],
      [0, 0],
      [0, 0],
    ];
    expect(selfIntersectionDetected(ring)).toBe(true);
  });

  test('getSegmentPoints returns expected start/end for pointCount=4', () => {
    const ring = [
      [0, 0],
      [5, 0],
      [5, 5],
      [0, 5],
      [0, 0],
    ];
    const { start, end } = getSegmentPoints(ring, 4);
    // With pointCount=4, start index = 2, end index = 3
    expect(start).toEqual([5, 5]);
    expect(end).toEqual([0, 5]);
  });
});
