import { ViewportBounds } from '../../../common/components/map/hooks/useMapViewportBounds';

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
    return [requestedBounds].filter(
      (area) => (area.maxX - area.minX) * (area.maxY - area.minY) >= minAreaSize,
    );
  }

  // Start with the full requested area as "missing"
  let missingAreas: ViewportBounds[] = [requestedBounds];

  // For each cached viewport, subtract it from all current missing areas
  for (const cached of cachedBounds) {
    const newMissingAreas: ViewportBounds[] = [];

    for (const area of missingAreas) {
      // Calculate the intersection between the area and cached bounds
      const intersectionMinX = Math.max(area.minX, cached.minX);
      const intersectionMaxX = Math.min(area.maxX, cached.maxX);
      const intersectionMinY = Math.max(area.minY, cached.minY);
      const intersectionMaxY = Math.min(area.maxY, cached.maxY);

      // Check if there's an actual intersection
      if (intersectionMinX < intersectionMaxX && intersectionMinY < intersectionMaxY) {
        // There's an intersection - split the area into up to 4 non-overlapping rectangles

        // Left rectangle (if exists)
        if (area.minX < intersectionMinX) {
          newMissingAreas.push({
            minX: area.minX,
            maxX: intersectionMinX,
            minY: area.minY,
            maxY: area.maxY,
          });
        }

        // Right rectangle (if exists)
        if (area.maxX > intersectionMaxX) {
          newMissingAreas.push({
            minX: intersectionMaxX,
            maxX: area.maxX,
            minY: area.minY,
            maxY: area.maxY,
          });
        }

        // Top rectangle (if exists) - only the middle part not covered by left/right
        if (area.minY < intersectionMinY) {
          newMissingAreas.push({
            minX: intersectionMinX,
            maxX: intersectionMaxX,
            minY: area.minY,
            maxY: intersectionMinY,
          });
        }

        // Bottom rectangle (if exists) - only the middle part not covered by left/right
        if (area.maxY > intersectionMaxY) {
          newMissingAreas.push({
            minX: intersectionMinX,
            maxX: intersectionMaxX,
            minY: intersectionMaxY,
            maxY: area.maxY,
          });
        }
      } else {
        // No intersection - keep the original area
        newMissingAreas.push(area);
      }
    }

    missingAreas = newMissingAreas;
  }

  // Filter out very small areas to avoid excessive API calls
  return missingAreas.filter(
    (area) => (area.maxX - area.minX) * (area.maxY - area.minY) >= minAreaSize,
  );
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
