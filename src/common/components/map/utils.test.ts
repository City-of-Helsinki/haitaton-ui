import { Polygon } from 'ol/geom';
import { isPolygonSelfIntersecting } from './utils';

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
