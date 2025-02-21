import { areDatesWithinInterval, featureContains } from './utils';
import { feature, polygon } from '@turf/helpers';

describe('areDatesWithinInterval', () => {
  test('returns true if date range is within the given interval', () => {
    const interval = { start: new Date('2023-01-01'), end: new Date('2023-12-31') };
    const dateRange = { start: new Date('2023-06-01'), end: new Date('2023-06-30') };
    expect(areDatesWithinInterval(interval)(dateRange)).toBe(true);
  });

  test('returns false if date range is completely outside the interval', () => {
    const interval = { start: new Date('2023-01-01'), end: new Date('2023-12-31') };
    const dateRange = { start: new Date('2024-01-01'), end: new Date('2024-01-31') };
    expect(areDatesWithinInterval(interval)(dateRange)).toBe(false);
  });

  test('returns true if date range starts before and ends within the interval with allowOverlapping option', () => {
    const interval = { start: new Date('2023-01-01'), end: new Date('2023-12-31') };
    const dateRange = { start: new Date('2022-12-01'), end: new Date('2023-01-15') };
    expect(areDatesWithinInterval(interval, { allowOverlapping: true })(dateRange)).toBe(true);
  });

  test('returns true if date range starts within and ends after the interval with allowOverlapping option', () => {
    const interval = { start: new Date('2023-01-01'), end: new Date('2023-12-31') };
    const dateRange = { start: new Date('2023-12-15'), end: new Date('2024-01-15') };
    expect(areDatesWithinInterval(interval, { allowOverlapping: true })(dateRange)).toBe(true);
  });

  test('returns false if date range starts before and ends after the interval without allowOverlapping option', () => {
    const interval = { start: new Date('2023-01-01'), end: new Date('2023-12-31') };
    const dateRange = { start: new Date('2022-12-01'), end: new Date('2024-01-15') };
    expect(areDatesWithinInterval(interval)(dateRange)).toBe(false);
  });

  test('returns true if date range exactly matches the interval', () => {
    const interval = { start: new Date('2023-01-01'), end: new Date('2023-12-31') };
    const dateRange = { start: new Date('2023-01-01'), end: new Date('2023-12-31') };
    expect(areDatesWithinInterval(interval)(dateRange)).toBe(true);
  });

  test('returns false if date range is partially outside the interval without allowOverlapping option', () => {
    const interval = { start: new Date('2023-01-01'), end: new Date('2023-12-31') };
    const dateRange = { start: new Date('2022-12-15'), end: new Date('2023-01-15') };
    expect(areDatesWithinInterval(interval)(dateRange)).toBe(false);
  });
});

describe('featureContains', () => {
  test('returns true if features are equal', () => {
    const feature1 = feature(
      polygon([
        [
          [0, 0],
          [0, 3],
          [3, 3],
          [3, 0],
          [0, 0],
        ],
      ]).geometry,
    );
    const feature2 = feature(
      polygon([
        [
          [0, 0],
          [0, 3],
          [3, 3],
          [3, 0],
          [0, 0],
        ],
      ]).geometry,
    );
    expect(featureContains(feature1, feature2)).toBe(true);
  });

  test('returns true if feature2 is inside feature1', () => {
    const feature1 = feature(
      polygon([
        [
          [0, 0],
          [0, 3],
          [3, 3],
          [3, 0],
          [0, 0],
        ],
      ]).geometry,
    );
    const feature2 = feature(
      polygon([
        [
          [1, 1],
          [1, 2],
          [2, 2],
          [2, 1],
          [1, 1],
        ],
      ]).geometry,
    );
    expect(featureContains(feature1, feature2)).toBe(true);
  });

  test('returns false if feature2 is partially outside feature1', () => {
    const feature1 = feature(
      polygon([
        [
          [0, 0],
          [0, 3],
          [3, 3],
          [3, 0],
          [0, 0],
        ],
      ]).geometry,
    );
    const feature2 = feature(
      polygon([
        [
          [1, 1],
          [1, 4],
          [4, 4],
          [4, 1],
          [1, 1],
        ],
      ]).geometry,
    );
    expect(featureContains(feature1, feature2)).toBe(false);
  });

  test('returns false if feature2 is completely outside feature1', () => {
    const feature1 = feature(
      polygon([
        [
          [0, 0],
          [0, 3],
          [3, 3],
          [3, 0],
          [0, 0],
        ],
      ]).geometry,
    );
    const feature2 = feature(
      polygon([
        [
          [4, 0],
          [4, 3],
          [7, 3],
          [7, 0],
          [4, 0],
        ],
      ]).geometry,
    );
    expect(featureContains(feature1, feature2)).toBe(false);
  });
});
