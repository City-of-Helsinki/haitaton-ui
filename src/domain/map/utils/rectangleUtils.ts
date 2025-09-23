import { ViewportBounds } from '../../../common/components/map/hooks/useMapViewportBounds';

// Helper function to calculate rectangle intersection bounds
function calculateIntersection(area: ViewportBounds, cached: ViewportBounds) {
  return {
    minX: Math.max(area.minX, cached.minX),
    maxX: Math.min(area.maxX, cached.maxX),
    minY: Math.max(area.minY, cached.minY),
    maxY: Math.min(area.maxY, cached.maxY),
  };
}

// Helper function to check if intersection exists
function hasIntersection(intersection: { minX: number; maxX: number; minY: number; maxY: number }) {
  return intersection.minX < intersection.maxX && intersection.minY < intersection.maxY;
}

// Helper function to create non-overlapping rectangles from area subtraction
function createNonOverlappingRectangles(
  area: ViewportBounds,
  intersection: { minX: number; maxX: number; minY: number; maxY: number },
): ViewportBounds[] {
  const rectangles: ViewportBounds[] = [];

  // Left rectangle (if exists)
  if (area.minX < intersection.minX) {
    rectangles.push({
      minX: area.minX,
      maxX: intersection.minX,
      minY: area.minY,
      maxY: area.maxY,
    });
  }

  // Right rectangle (if exists)
  if (area.maxX > intersection.maxX) {
    rectangles.push({
      minX: intersection.maxX,
      maxX: area.maxX,
      minY: area.minY,
      maxY: area.maxY,
    });
  }

  // Top rectangle (if exists) - only the middle part not covered by left/right
  if (area.minY < intersection.minY) {
    rectangles.push({
      minX: intersection.minX,
      maxX: intersection.maxX,
      minY: area.minY,
      maxY: intersection.minY,
    });
  }

  // Bottom rectangle (if exists) - only the middle part not covered by left/right
  if (area.maxY > intersection.maxY) {
    rectangles.push({
      minX: intersection.minX,
      maxX: intersection.maxX,
      minY: intersection.maxY,
      maxY: area.maxY,
    });
  }

  return rectangles;
}

// Helper function to process single area against cached bounds
function subtractCachedFromArea(area: ViewportBounds, cached: ViewportBounds): ViewportBounds[] {
  const intersection = calculateIntersection(area, cached);

  if (hasIntersection(intersection)) {
    return createNonOverlappingRectangles(area, intersection);
  }

  // No intersection - keep the original area
  return [area];
}

// Helper function to filter areas by minimum size
function filterAreasBySize(areas: ViewportBounds[], minAreaSize: number): ViewportBounds[] {
  return areas.filter((area) => (area.maxX - area.minX) * (area.maxY - area.minY) >= minAreaSize);
}

/**
 * Calculates the missing rectangular areas that are not covered by cached viewports.
 *
 * @param requestedBounds - The viewport bounds that are requested
 * @param cachedBounds - Array of already cached viewport bounds
 * @param minAreaSize - Minimum area size threshold to avoid tiny requests (default: 100)
 * @returns Array of viewport bounds that need to be fetched
 */
export function calculateMissingViewportAreas(
  requestedBounds: ViewportBounds,
  cachedBounds: ViewportBounds[],
  minAreaSize: number = 100,
): ViewportBounds[] {
  if (cachedBounds.length === 0) {
    return filterAreasBySize([requestedBounds], minAreaSize);
  }

  // Start with the full requested area as "missing"
  let missingAreas: ViewportBounds[] = [requestedBounds];

  // For each cached viewport, subtract it from all current missing areas
  for (const cached of cachedBounds) {
    const newMissingAreas: ViewportBounds[] = [];

    for (const area of missingAreas) {
      newMissingAreas.push(...subtractCachedFromArea(area, cached));
    }

    missingAreas = newMissingAreas;
  }

  return filterAreasBySize(missingAreas, minAreaSize);
}

/**
 * Helper function to check if two rectangles intersect
 */
export function rectanglesIntersect(rect1: ViewportBounds, rect2: ViewportBounds): boolean {
  return !(
    rect1.maxX <= rect2.minX ||
    rect1.minX >= rect2.maxX ||
    rect1.maxY <= rect2.minY ||
    rect1.minY >= rect2.maxY
  );
}

/**
 * Helper function to calculate the area of a rectangle
 */
export function calculateRectangleArea(bounds: ViewportBounds): number {
  return (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);
}
