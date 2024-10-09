import { areDatesWithinInterval } from './utils';

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
