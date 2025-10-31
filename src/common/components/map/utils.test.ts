import { Point, Polygon } from 'ol/geom';
import { getSurfaceArea, isPolygonSelfIntersecting } from './utils';

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
