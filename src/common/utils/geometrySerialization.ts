import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';

const geoJson = new GeoJSON();

export interface SerializedGeometry {
  type: string;
  // GeoJSON coordinate arrays (Polygon | MultiPolygon etc.) – structure varies by type
  coordinates: unknown;
}

// Supported geometry shapes persisted by the app. These are GeoJSON geometry types and map
// directly to OpenLayers geometry classes used by the application. We intentionally persist
// only the geometry object ({ type, coordinates }) so that hydration can recreate a clean
// Feature + Geometry pair without UI-specific metadata.
//
// - Point
// - MultiPoint
// - LineString
// - MultiLineString
// - Polygon
// - MultiPolygon

export interface SerializedFeatureGeometry {
  id: string | number | null;
  geometry: SerializedGeometry | null;
  // Optional lightweight metadata expansion point
  name?: string | null;
}

export function serializeFeatureGeometry(
  feature: Feature<Geometry> | undefined | null,
): SerializedGeometry | null {
  if (!feature) return null;
  const geom = feature.getGeometry();
  if (!geom) return null;
  // writeGeometryObject returns a plain object { type, coordinates }
  const obj = geoJson.writeGeometryObject(geom) as SerializedGeometry;
  return { type: obj.type, coordinates: obj.coordinates };
}

export function serializeAreaLike(area: {
  id?: unknown;
  nimi?: string | null;
  feature?: Feature<Geometry> | null;
}): SerializedFeatureGeometry {
  return {
    id: (area.id as string | number | null) ?? null,
    name: area.nimi ?? null,
    geometry: serializeFeatureGeometry(area.feature),
  };
}

export function deserializeGeometry(serial: SerializedGeometry | null): Geometry | null {
  if (!serial) return null;
  try {
    return geoJson.readGeometry({ type: serial.type, coordinates: serial.coordinates });
  } catch {
    // Corrupt snapshot – ignore
    return null;
  }
}

export function hydrateAreaFeature(
  area: { feature?: Feature<Geometry> | null },
  serial: SerializedFeatureGeometry,
): Feature<Geometry> | null {
  const existing = area.feature ?? new Feature<Geometry>();
  const geom = deserializeGeometry(serial.geometry);
  if (geom) {
    existing.setGeometry(geom);
  }
  return existing;
}

// ---- Batch helpers (UI form persistence convenience) ----

/** Serialize an array of form areas that hold an OpenLayers Feature in a `feature` property. */
export function serializeFeatureGeometries(
  areas:
    | Array<{ id?: unknown; nimi?: string | null; feature?: Feature<Geometry> | null }>
    | null
    | undefined,
): SerializedFeatureGeometry[] {
  if (!areas) return [];
  return areas.map((a) => serializeAreaLike(a));
}

/**
 * Rehydrate (mutate) an array of target area objects by applying serialized geometries. The target
 * array length should match the serialized list; extra serialized entries are ignored.
 */
export function hydrateFeatureGeometries(
  targets: Array<{ feature?: Feature<Geometry> | null }> | null | undefined,
  serials: SerializedFeatureGeometry[] | null | undefined,
) {
  if (!targets || !serials) return;
  for (let i = 0; i < Math.min(targets.length, serials.length); i++) {
    const serial = serials[i];
    if (!serial) continue;
    const feature = hydrateAreaFeature(targets[i], serial);
    if (feature) {
      // eslint-disable-next-line no-param-reassign
      targets[i].feature = feature;
    }
  }
}
