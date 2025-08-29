import { Point, Polygon } from 'ol/geom';
import {
  getSurfaceArea,
  isPolygonSelfIntersecting,
  getLinesFromCoordinates,
  getCoordinateNumbersFromCoordinate,
  getLineIntersection,
  isPolygonSelfIntersectingByCoordinates,
  areLinesInPolygonIntersecting,
  linesIntersect,
} from './utils';

describe('surface area', () => {
  test('should return correct surface area for a polygon', () => {
    const polygonToCheck = new Polygon([
      [
        [25496681.078125, 6673024.67578125],
        [25496905.16015625, 6673024.67578125],
        [25496905.16015625, 6673156.75],
        [25496681.078125, 6673156.75],
        [25496681.078125, 6673024.67578125],
      ],
    ]);

    const result = getSurfaceArea(polygonToCheck);

    expect(result).toBeCloseTo(29595.459213256836, 1);
  });

  test('should return NaN when the geometry is not a polygon', () => {
    const pointToCheck = new Point([25496681.078125, 6673024.67578125]);

    const result = getSurfaceArea(pointToCheck);

    expect(result).toBe(NaN);
  });
});

describe('self-intersecting polygon', () => {
  test('should return true if polygon is self-intersecting', () => {
    const polygonToCheck = new Polygon([
      [
        [25493972.126237143, 6679883.369694488],
        [25493977.162858237, 6679879.627018707],
        [25493982.92653011, 6679890.536442535],
        [25493977.506852377, 6679894.089421051],
        [25493974.86329769, 6679881.331608551],
        [25493972.126237143, 6679883.369694488],
      ],
    ]);
    const result = isPolygonSelfIntersecting(polygonToCheck);

    expect(result).toBe(true);
  });

  test('should return false if polygon is not self-intersecting', () => {
    const polygonToCheck = new Polygon([
      [
        [25493972.126237143, 6679883.369694488],
        [25493977.162858237, 6679879.627018707],
        [25493983.059586756, 6679890.565983552],
        [25493977.506852377, 6679894.089421051],
        [25493974.74903988, 6679881.466862458],
        [25493972.126237143, 6679883.369694488],
      ],
    ]);
    const result = isPolygonSelfIntersecting(polygonToCheck);

    expect(result).toBe(false);
  });
});

describe('getLinesFromCoordinates', () => {
  test('should return correct lines from coordinates', () => {
    const coordinates = [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ];
    const result = getLinesFromCoordinates(coordinates);
    expect(result).toEqual([
      [
        [0, 0],
        [1, 0],
      ],
      [
        [1, 0],
        [1, 1],
      ],
      [
        [1, 1],
        [0, 1],
      ],
      [
        [0, 1],
        [0, 0],
      ],
    ]);
  });
});

describe('getCoordinateNumbersFromCoordinate', () => {
  test('should return numbers from coordinate', () => {
    const coordinate = [5, 10];
    const result = getCoordinateNumbersFromCoordinate(coordinate);
    expect(result).toEqual([5, 10]);
  });
});

describe('getLineIntersection', () => {
  test('should return intersection point for crossing lines', () => {
    const result = getLineIntersection([0, 0], [2, 2], [0, 2], [2, 0]);
    expect(result).toEqual([1, 1]);
  });
  test('should return null for parallel lines', () => {
    const result = getLineIntersection([0, 0], [1, 0], [0, 1], [1, 1]);
    expect(result).toBeNull();
  });
  test('should return null for non-intersecting segments', () => {
    const result = getLineIntersection([0, 0], [1, 0], [2, 2], [3, 3]);
    expect(result).toBeNull();
  });
});

describe('isPolygonSelfIntersectingByCoordinates', () => {
  test('should return true for self-intersecting coordinates', () => {
    const coordinates = [
      [
        [0, 0],
        [2, 2],
        [0, 2],
        [2, 0],
        [0, 0],
      ],
    ];
    expect(isPolygonSelfIntersectingByCoordinates(coordinates)).toBe(true);
  });
  test('should return false for non-self-intersecting coordinates', () => {
    const coordinates = [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ];
    expect(isPolygonSelfIntersectingByCoordinates(coordinates)).toBe(false);
  });
  test('should return false for invalid input', () => {
    expect(isPolygonSelfIntersectingByCoordinates([])).toBe(false);
  });
});

describe('areLinesInPolygonIntersecting', () => {
  test('returns false for non-intersecting polygon', () => {
    const coordinates = [
      [
        [0, 0],
        [0, 10],
        [10, 10],
        [10, 0],
      ],
    ];
    expect(areLinesInPolygonIntersecting(coordinates)).toBe(false);
  });
  test('returns true for self-intersecting polygon', () => {
    const coordinates = [
      [
        [0, 0],
        [2, 2],
        [0, 2],
        [2, 0],
      ],
    ];
    expect(areLinesInPolygonIntersecting(coordinates)).toBe(true);
  });
  test('returns false for polygon with less than 3 lines', () => {
    const coordinates = [
      [
        [0, 0],
        [1, 1],
        [0, 0],
      ],
    ];
    expect(areLinesInPolygonIntersecting(coordinates)).toBe(false);
  });
});

describe('linesIntersect', () => {
  test('returns true for intersecting lines', () => {
    expect(linesIntersect([0, 0], [2, 2], [0, 2], [2, 0])).toBe(true);
  });
  test('returns false for parallel lines', () => {
    expect(linesIntersect([0, 0], [1, 0], [0, 1], [1, 1])).toBe(false);
  });
  test('returns false for colinear but non-overlapping lines', () => {
    expect(linesIntersect([0, 0], [1, 1], [2, 2], [3, 3])).toBe(false);
  });
});
