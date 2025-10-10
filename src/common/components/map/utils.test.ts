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
  isSegmentWithinHankeArea,
  numericEdge,
  isIntersectionAtAnyEndpoint,
  hasInvalidInteriorIntersection,
  getCandidateSegmentForValidation,
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
  test('returns true for bow-tie when closing segment intersects (closing end equals first vertex)', () => {
    // Bow-tie shape: last segment from [3,3] to [0,0] crosses interior
    const coordinates = [
      [
        [0, 0], // start
        [3, 3],
        [0, 3],
        [3, 0],
        [0, 0], // implicit closing (OL would add this as final link)
      ],
    ];
    expect(areLinesInPolygonIntersecting(coordinates)).toBe(true);
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

describe('isSegmentWithinHankeArea', () => {
  const squareCoords = [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ];

  const mockFeatureWithGeom = (coords: number[][][]) => ({
    getGeometry: () => ({
      getCoordinates: () => coords,
    }),
  });

  test('returns false when no hanke features under cursor', () => {
    const getPixelFromCoordinate = jest.fn(() => [0, 0]);
    const getFeaturesAtPixel = jest.fn(() => []);
    const map = {
      getPixelFromCoordinate,
      getFeaturesAtPixel,
    } as unknown as import('ol').Map;

    const latestLine: [[number, number], [number, number]] = [
      [0.2, 0.2],
      [0.8, 0.2],
    ];
    const result = isSegmentWithinHankeArea(
      map,
      latestLine,
      // layer filter can be a no-op for this test
      () => true,
    );
    expect(result).toBe(false);
    expect(getPixelFromCoordinate).toHaveBeenCalled();
    expect(getFeaturesAtPixel).toHaveBeenCalled();
  });

  test('returns false when topmost hanke feature has no geometry', () => {
    const map = {
      getPixelFromCoordinate: jest.fn(() => [0, 0]),
      getFeaturesAtPixel: jest.fn(() => [{ getGeometry: () => undefined }]),
    } as unknown as import('ol').Map;

    const latestLine: [[number, number], [number, number]] = [
      [0.2, 0.2],
      [0.8, 0.2],
    ];
    expect(isSegmentWithinHankeArea(map, latestLine, () => true)).toBe(false);
  });

  test('returns false when segment crosses the polygon boundary (not at endpoints)', () => {
    const map = {
      getPixelFromCoordinate: jest.fn(() => [0, 0]),
      getFeaturesAtPixel: jest.fn(() => [mockFeatureWithGeom(squareCoords)]),
    } as unknown as import('ol').Map;

    // Start inside the square and end outside, crossing mid-edge (y = 0.5)
    const latestLine: [[number, number], [number, number]] = [
      [0.5, 0.5], // inside
      [1.5, 0.5], // outside -> crosses edge between [1,0] and [1,1]
    ];

    expect(isSegmentWithinHankeArea(map, latestLine, () => true)).toBe(false);
  });

  test('returns true when segment is entirely inside the polygon', () => {
    const map = {
      getPixelFromCoordinate: jest.fn(() => [0, 0]),
      getFeaturesAtPixel: jest.fn(() => [mockFeatureWithGeom(squareCoords)]),
    } as unknown as import('ol').Map;

    const latestLine: [[number, number], [number, number]] = [
      [0.2, 0.2],
      [0.8, 0.2],
    ];

    expect(isSegmentWithinHankeArea(map, latestLine, () => true)).toBe(true);
  });

  test('returns true when intersection occurs exactly at an endpoint', () => {
    const map = {
      getPixelFromCoordinate: jest.fn(() => [0, 0]),
      getFeaturesAtPixel: jest.fn(() => [mockFeatureWithGeom(squareCoords)]),
    } as unknown as import('ol').Map;

    // From inside to a corner point (0,0) -> intersection at the endpoint should be allowed
    const latestLine: [[number, number], [number, number]] = [
      [0.5, 0.5],
      [0, 0],
    ];

    expect(isSegmentWithinHankeArea(map, latestLine, () => true)).toBe(true);
  });
});

describe('intersection helpers', () => {
  test('numericEdge returns numeric endpoints', () => {
    const edge: [number[], number[]] = [
      [1, 2],
      [3, 4],
    ];
    const [a, b] = numericEdge(edge as [number[], number[]]);
    expect(a).toEqual([1, 2]);
    expect(b).toEqual([3, 4]);
  });
  test('isIntersectionAtAnyEndpoint detects when an intersection matches an endpoint', () => {
    expect(
      isIntersectionAtAnyEndpoint(
        [1, 2],
        [
          [0, 0],
          [1, 2],
        ],
      ),
    ).toBe(true);
    expect(
      isIntersectionAtAnyEndpoint(
        [1, 2],
        [
          [0, 0],
          [2, 2],
        ],
      ),
    ).toBe(false);
  });
  test('hasInvalidInteriorIntersection returns true for interior crossing', () => {
    const aStart: [number, number] = [0, 0];
    const aEnd: [number, number] = [2, 2];
    const bStart: [number, number] = [0, 2];
    const bEnd: [number, number] = [2, 0];
    expect(hasInvalidInteriorIntersection(aStart, aEnd, bStart, bEnd, true)).toBe(true);
  });
  test('hasInvalidInteriorIntersection returns false for shared endpoint only', () => {
    const aStart: [number, number] = [0, 0];
    const aEnd: [number, number] = [2, 0];
    const bStart: [number, number] = [0, 0];
    const bEnd: [number, number] = [0, 2];
    expect(hasInvalidInteriorIntersection(aStart, aEnd, bStart, bEnd, true)).toBe(false);
  });
  test('getCandidateSegmentForValidation distinguishes closed vs incremental polygon', () => {
    const incremental = [
      [
        [0, 0],
        [5, 0],
        [5, 5],
      ],
    ];
    const incLines = getLinesFromCoordinates(
      incremental as unknown as import('ol/coordinate').Coordinate[][],
    );
    const incCandidate = getCandidateSegmentForValidation(
      incremental as unknown as import('ol/coordinate').Coordinate[][],
      incLines as [import('ol/coordinate').Coordinate, import('ol/coordinate').Coordinate][],
    );
    expect(incCandidate.isClosed).toBe(false);
    const closed = [
      [
        [0, 0],
        [5, 0],
        [5, 5],
        [0, 0],
      ],
    ];
    const closedLines = getLinesFromCoordinates(
      closed as unknown as import('ol/coordinate').Coordinate[][],
    );
    const closedCandidate = getCandidateSegmentForValidation(
      closed as unknown as import('ol/coordinate').Coordinate[][],
      closedLines as [import('ol/coordinate').Coordinate, import('ol/coordinate').Coordinate][],
    );
    expect(closedCandidate.isClosed).toBe(true);
  });
});
