interface GridMetadata {
  cellSizeMeters: number;
  originX: number;
  originY: number;
  maxX: number;
  maxY: number;
}

interface GridCell {
  x: number;
  y: number;
}

interface ViewportBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Converts viewport bounds to grid cells for efficient data fetching
 * @param bounds Viewport bounds in coordinate system
 * @param metadata Grid metadata from server
 * @param maxCells Maximum number of cells to generate (for performance)
 * @returns Array of grid cells covering the viewport
 */
export function getGridCellsForViewport(
  bounds: ViewportBounds,
  metadata: GridMetadata,
  maxCells: number = 100,
): GridCell[] {
  const { cellSizeMeters, originX, originY, maxX, maxY } = metadata;

  // Convert bounds to grid coordinates
  const minCellX = Math.max(0, Math.floor((bounds.minX - originX) / cellSizeMeters));
  const maxCellX = Math.min(
    Math.floor((maxX - originX) / cellSizeMeters),
    Math.floor((bounds.maxX - originX) / cellSizeMeters),
  );
  const minCellY = Math.max(0, Math.floor((bounds.minY - originY) / cellSizeMeters));
  const maxCellY = Math.min(
    Math.floor((maxY - originY) / cellSizeMeters),
    Math.floor((bounds.maxY - originY) / cellSizeMeters),
  );

  const cells: GridCell[] = [];

  // Generate cells, but limit total number for performance
  let cellCount = 0;
  for (let x = minCellX; x <= maxCellX && cellCount < maxCells; x++) {
    for (let y = minCellY; y <= maxCellY && cellCount < maxCells; y++) {
      cells.push({ x, y });
      cellCount++;
    }
  }

  return cells;
}
