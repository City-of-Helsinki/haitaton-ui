import {
  calculateMissingViewportAreas,
  rectanglesIntersect,
  calculateRectangleArea,
} from './rectangleUtils';
import { ViewportBounds } from '../../../common/components/map/hooks/useMapViewportBounds';

describe('rectangleUtils', () => {
  describe('calculateRectangleArea', () => {
    test('calculates area correctly', () => {
      const bounds: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 5 };
      expect(calculateRectangleArea(bounds)).toBe(50);
    });

    test('handles negative coordinates', () => {
      const bounds: ViewportBounds = { minX: -10, maxX: -5, minY: -3, maxY: 2 };
      expect(calculateRectangleArea(bounds)).toBe(25); // 5 * 5
    });
  });

  describe('rectanglesIntersect', () => {
    test('returns true for overlapping rectangles', () => {
      const rect1: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      const rect2: ViewportBounds = { minX: 5, maxX: 15, minY: 5, maxY: 15 };
      expect(rectanglesIntersect(rect1, rect2)).toBe(true);
    });

    test('returns false for non-overlapping rectangles', () => {
      const rect1: ViewportBounds = { minX: 0, maxX: 5, minY: 0, maxY: 5 };
      const rect2: ViewportBounds = { minX: 10, maxX: 15, minY: 10, maxY: 15 };
      expect(rectanglesIntersect(rect1, rect2)).toBe(false);
    });

    test('returns false for adjacent rectangles', () => {
      const rect1: ViewportBounds = { minX: 0, maxX: 5, minY: 0, maxY: 5 };
      const rect2: ViewportBounds = { minX: 5, maxX: 10, minY: 0, maxY: 5 };
      expect(rectanglesIntersect(rect1, rect2)).toBe(false);
    });

    test('returns true for identical rectangles', () => {
      const rect1: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      const rect2: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      expect(rectanglesIntersect(rect1, rect2)).toBe(true);
    });
  });

  describe('calculateMissingViewportAreas', () => {
    test('returns entire area when no cached bounds', () => {
      const requested: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      const cached: ViewportBounds[] = [];

      const result = calculateMissingViewportAreas(requested, cached);

      expect(result).toEqual([requested]);
    });

    test('returns empty array when requested area is fully cached', () => {
      const requested: ViewportBounds = { minX: 5, maxX: 8, minY: 5, maxY: 8 };
      const cached: ViewportBounds[] = [{ minX: 0, maxX: 10, minY: 0, maxY: 10 }];

      const result = calculateMissingViewportAreas(requested, cached);

      expect(result).toEqual([]);
    });

    test('returns requested area when no intersection with cached areas', () => {
      const requested: ViewportBounds = { minX: 0, maxX: 5, minY: 0, maxY: 5 };
      const cached: ViewportBounds[] = [{ minX: 10, maxX: 15, minY: 10, maxY: 15 }];

      const result = calculateMissingViewportAreas(requested, cached);
      console.log('No intersection test - result:', result);
      console.log('No intersection test - requested area:', calculateRectangleArea(requested));

      expect(result).toEqual([requested]);
    });

    test('calculates missing areas when cached area is in the center', () => {
      const requested: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      const cached: ViewportBounds[] = [{ minX: 3, maxX: 7, minY: 3, maxY: 7 }];

      const result = calculateMissingViewportAreas(requested, cached);

      // Should return 4 rectangles: left, right, top, bottom
      expect(result).toHaveLength(4);

      // Left rectangle
      expect(result).toContainEqual({ minX: 0, maxX: 3, minY: 0, maxY: 10 });
      // Right rectangle
      expect(result).toContainEqual({ minX: 7, maxX: 10, minY: 0, maxY: 10 });
      // Top rectangle
      expect(result).toContainEqual({ minX: 3, maxX: 7, minY: 0, maxY: 3 });
      // Bottom rectangle
      expect(result).toContainEqual({ minX: 3, maxX: 7, minY: 7, maxY: 10 });
    });

    test('calculates missing areas when cached area overlaps left side', () => {
      const requested: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      const cached: ViewportBounds[] = [{ minX: -5, maxX: 5, minY: 2, maxY: 8 }];

      const result = calculateMissingViewportAreas(requested, cached);

      // Should return 3 rectangles: right, top, bottom
      expect(result).toHaveLength(3);

      // Right rectangle
      expect(result).toContainEqual({ minX: 5, maxX: 10, minY: 0, maxY: 10 });
      // Top rectangle
      expect(result).toContainEqual({ minX: 0, maxX: 5, minY: 0, maxY: 2 });
      // Bottom rectangle
      expect(result).toContainEqual({ minX: 0, maxX: 5, minY: 8, maxY: 10 });
    });

    test('handles multiple cached areas', () => {
      const requested: ViewportBounds = { minX: 0, maxX: 20, minY: 0, maxY: 10 };
      const cached: ViewportBounds[] = [
        { minX: 2, maxX: 8, minY: 2, maxY: 8 },
        { minX: 12, maxX: 18, minY: 2, maxY: 8 },
      ];

      const result = calculateMissingViewportAreas(requested, cached);

      // Should have multiple missing areas
      expect(result.length).toBeGreaterThan(0);

      // Total area of result should be less than original requested area
      const totalMissingArea = result.reduce((sum, area) => sum + calculateRectangleArea(area), 0);
      const requestedArea = calculateRectangleArea(requested);
      expect(totalMissingArea).toBeLessThan(requestedArea);
    });

    test('filters out areas smaller than minimum size', () => {
      const requested: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      const cached: ViewportBounds[] = [{ minX: 1, maxX: 9, minY: 1, maxY: 9 }];
      const minAreaSize = 50; // Large minimum size

      const result = calculateMissingViewportAreas(requested, cached, minAreaSize);

      // Should filter out small edge rectangles
      const smallAreas = result.filter((area) => calculateRectangleArea(area) < minAreaSize);
      expect(smallAreas).toHaveLength(0);
    });

    test('handles edge case where cached area exactly matches requested area', () => {
      const requested: ViewportBounds = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      const cached: ViewportBounds[] = [{ minX: 0, maxX: 10, minY: 0, maxY: 10 }];

      const result = calculateMissingViewportAreas(requested, cached);

      expect(result).toEqual([]);
    });

    test('handles cached area that completely contains requested area', () => {
      const requested: ViewportBounds = { minX: 5, maxX: 8, minY: 5, maxY: 8 };
      const cached: ViewportBounds[] = [{ minX: 0, maxX: 15, minY: 0, maxY: 15 }];

      const result = calculateMissingViewportAreas(requested, cached);

      expect(result).toEqual([]);
    });

    test('handles zero-area rectangles', () => {
      const requested: ViewportBounds = { minX: 0, maxX: 0, minY: 0, maxY: 10 };
      const cached: ViewportBounds[] = [];

      const result = calculateMissingViewportAreas(requested, cached);

      // Zero-width rectangle should be filtered out by default min area size
      expect(result).toEqual([]);
    });
  });
});
