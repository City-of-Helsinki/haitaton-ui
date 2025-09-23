import { getGridCellsForViewport } from './gridUtils';

describe('Grid Utilities', () => {
  const mockMetadata = {
    cellSizeMeters: 1000,
    originX: 25440000,
    originY: 6630000,
    maxX: 25500000,
    maxY: 6690000,
  };

  describe('getGridCellsForViewport', () => {
    test('calculates grid cells correctly for viewport within grid bounds', () => {
      const bounds = {
        minX: 25445000,
        minY: 6635000,
        maxX: 25446000,
        maxY: 6636000,
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      expect(cells).toHaveLength(4);
      expect(cells).toEqual([
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 6, y: 5 },
        { x: 6, y: 6 },
      ]);
    });

    test('returns empty array when viewport is completely outside grid bounds', () => {
      const bounds = {
        minX: 20000000,
        minY: 6000000,
        maxX: 20001000,
        maxY: 6001000,
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      expect(cells).toHaveLength(0);
    });

    test('clips cells to grid boundaries when viewport extends beyond grid', () => {
      const bounds = {
        minX: 25495000, // Near right edge
        minY: 6685000, // Near top edge
        maxX: 25510000, // Beyond right edge
        maxY: 6700000, // Beyond top edge
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      // Should be clipped to grid boundaries
      expect(cells.every((cell) => cell.x <= 60)).toBe(true); // maxX grid cell
      expect(cells.every((cell) => cell.y <= 60)).toBe(true); // maxY grid cell
      expect(cells.every((cell) => cell.x >= 55)).toBe(true); // minX for this viewport
      expect(cells.every((cell) => cell.y >= 55)).toBe(true); // minY for this viewport
    });

    test('handles viewport partially outside grid (left edge)', () => {
      const bounds = {
        minX: 25435000, // Before grid origin
        minY: 6635000,
        maxX: 25445000, // Within grid
        maxY: 6636000,
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      // Should start from grid origin (x=0)
      expect(cells.every((cell) => cell.x >= 0)).toBe(true);
      expect(cells.some((cell) => cell.x === 0)).toBe(true);
    });

    test('handles viewport partially outside grid (bottom edge)', () => {
      const bounds = {
        minX: 25445000,
        minY: 6625000, // Before grid origin
        maxX: 25446000,
        maxY: 6635000, // Within grid
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      // Should start from grid origin (y=0)
      expect(cells.every((cell) => cell.y >= 0)).toBe(true);
      expect(cells.some((cell) => cell.y === 0)).toBe(true);
    });

    test('respects maxCells limit', () => {
      const bounds = {
        minX: 25440000,
        minY: 6630000,
        maxX: 25460000, // 20 cells wide
        maxY: 6650000, // 20 cells tall
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 50); // Limit to 50 cells

      expect(cells).toHaveLength(50);
    });

    test('does not exceed maxCells even with very large viewport', () => {
      const bounds = {
        minX: 25440000,
        minY: 6630000,
        maxX: 25500000, // Full width
        maxY: 6690000, // Full height
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      expect(cells).toHaveLength(100);
    });

    test('handles single cell viewport', () => {
      const bounds = {
        minX: 25445000,
        minY: 6635000,
        maxX: 25445500, // Half a cell
        maxY: 6635500, // Half a cell
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      expect(cells).toHaveLength(1);
      expect(cells[0]).toEqual({ x: 5, y: 5 });
    });

    test('handles exact grid cell boundaries', () => {
      const bounds = {
        minX: 25445000, // Exactly on cell boundary
        minY: 6635000, // Exactly on cell boundary
        maxX: 25446000, // Exactly on next cell boundary
        maxY: 6636000, // Exactly on next cell boundary
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      expect(cells).toHaveLength(4);
      expect(cells).toContainEqual({ x: 5, y: 5 });
      expect(cells).toContainEqual({ x: 5, y: 6 });
      expect(cells).toContainEqual({ x: 6, y: 5 });
      expect(cells).toContainEqual({ x: 6, y: 6 });
    });

    test('handles fractional coordinates correctly', () => {
      const bounds = {
        minX: 25445123.456,
        minY: 6635789.012,
        maxX: 25446345.678,
        maxY: 6636901.234,
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      // Should floor coordinates properly
      expect(cells.every((cell) => Number.isInteger(cell.x))).toBe(true);
      expect(cells.every((cell) => Number.isInteger(cell.y))).toBe(true);
    });

    test('generates cells in consistent order (x first, then y)', () => {
      const bounds = {
        minX: 25445000,
        minY: 6635000,
        maxX: 25448000, // 3 cells wide (5, 6, 7, 8)
        maxY: 6637000, // 3 cells tall (5, 6, 7)
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      // Should have 12 cells total (4x3)
      expect(cells).toHaveLength(12);

      // Check order: x increments first, then y
      expect(cells[0]).toEqual({ x: 5, y: 5 });
      expect(cells[1]).toEqual({ x: 5, y: 6 });
      expect(cells[2]).toEqual({ x: 5, y: 7 });
      expect(cells[3]).toEqual({ x: 6, y: 5 });
      expect(cells[4]).toEqual({ x: 6, y: 6 });
      expect(cells[5]).toEqual({ x: 6, y: 7 });
    });

    test('handles edge case with zero-sized viewport', () => {
      const bounds = {
        minX: 25445000,
        minY: 6635000,
        maxX: 25445000, // Same as minX
        maxY: 6635000, // Same as minY
      };

      const cells = getGridCellsForViewport(bounds, mockMetadata, 100);

      expect(cells).toHaveLength(1);
      expect(cells[0]).toEqual({ x: 5, y: 5 });
    });
  });
});
