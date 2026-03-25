// Clean single implementation for persistence geometry helpers
//
// Supported geometry shapes
// - Point
// - MultiPoint
// - LineString
// - MultiLineString
// - Polygon
// - MultiPolygon
//
// Notes:
// - We persist only plain GeoJSON geometry objects in the form { type, coordinates }.
// - Projection and coordinate order follow the map's current projection (the app uses
//   the map coordinates directly; do not reproject during persistence).
// - OpenLayers Feature instances (and any style/meta attached) are intentionally omitted
//   from snapshots. Hydration recreates new Feature instances with geometry only.
// Geometry serialization helpers are no longer used here; we only keep small helpers

export type FormContextLike = {
  getValues: (path?: string) => unknown;
  setValue: (path: string, value: unknown, options?: { shouldDirty?: boolean }) => void;
};

// Helper: extract persisted array section (areas/alueet) from raw persisted payload.
export function extractPersistedArray(raw: unknown, snapshotKey: string) {
  if (!raw || typeof raw !== 'object') return undefined;
  const rawObj = raw as Record<string, unknown>;
  if (Array.isArray(rawObj[snapshotKey])) return rawObj[snapshotKey] as unknown[];
  return undefined;
}

// Helper: read and validate current array from form context at pathPrefix
// exported for testing.
export function getCurrentArray(formContext: FormContextLike, pathPrefix: string) {
  const current = formContext.getValues(pathPrefix);
  if (!Array.isArray(current)) return undefined;
  return current as Array<Record<string, unknown>>;
}

export function areasInclude(
  areas: Array<Record<string, unknown>> | null,
  area: Record<string, unknown>,
) {
  if (!areas) return false;
  return areas.some((a) => {
    return a.hankealueId === area.hankealueId;
  });
}
