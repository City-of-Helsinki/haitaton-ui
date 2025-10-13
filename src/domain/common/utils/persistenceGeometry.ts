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
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import {
  SerializedGeometry,
  serializeFeatureGeometry,
  deserializeGeometry,
} from '../../../common/utils/geometrySerialization';

export type FormContextLike = {
  getValues: (path?: string) => unknown;
  setValue: (path: string, value: unknown, options?: { shouldDirty?: boolean }) => void;
};

// Helper: Decide which raw geometry section to use: prefer '__geometry' snapshot container; fallback to legacy key.
function getGeometrySectionRaw(rawObj: Record<string, unknown>, snapshotKey: string): unknown {
  if (rawObj['__geometry']) return rawObj['__geometry'];
  if (rawObj[snapshotKey] !== undefined) return { [snapshotKey]: rawObj[snapshotKey] };
  return undefined;
}

// Helper: extract persisted array section (areas/alueet) from raw persisted payload.
export function extractPersistedArray(raw: unknown, snapshotKey: string) {
  if (!raw || typeof raw !== 'object') return undefined;
  const rawObj = raw as Record<string, unknown>;
  const geomSectionRaw = getGeometrySectionRaw(rawObj, snapshotKey);
  let persisted: unknown = undefined;
  if (geomSectionRaw && typeof geomSectionRaw === 'object') {
    const gs = geomSectionRaw as Record<string, unknown>;
    persisted = gs[snapshotKey] ?? geomSectionRaw;
  } else {
    persisted = geomSectionRaw;
  }
  return Array.isArray(persisted) ? (persisted as unknown[]) : undefined;
}

// Helper: read and validate current array from form context at pathPrefix
// exported for testing.
export function getCurrentArray(formContext: FormContextLike, pathPrefix: string) {
  const current = formContext.getValues(pathPrefix) as unknown;
  if (!Array.isArray(current)) return undefined;
  return current as Array<Record<string, unknown>>;
}

// Internal generic helper to hydrate an array of persisted entries into form state.
// Responsibilities:
// - Extract persisted snapshot array
// - Create placeholder entries if form array missing
// - Iterate entries and delegate geometry assignment to caller handler
function hydrateArrayGeometry(
  params: {
    raw: unknown;
    formContext: FormContextLike;
    pathPrefix: string;
    snapshotKey: string;
  },
  entryHandler: (entry: unknown, idx: number, currentItem: Record<string, unknown>) => void,
) {
  const { raw, formContext, pathPrefix, snapshotKey } = params;
  const persisted = extractPersistedArray(raw, snapshotKey);
  if (!persisted) return;
  let currentArr = getCurrentArray(formContext, pathPrefix);
  if (!currentArr) {
    const placeholders = persisted.map(() => ({}));
    formContext.setValue(pathPrefix, placeholders, { shouldDirty: false });
    currentArr = getCurrentArray(formContext, pathPrefix);
  }
  if (!currentArr) return;
  persisted.forEach((entry, idx) => {
    const currentItem = currentArr![idx];
    if (!currentItem) return;
    entryHandler(entry, idx, currentItem);
  });
}

export function buildJohtoAreasGeometrySnapshot<
  T extends Record<string, unknown> = Record<string, unknown>,
>(areas?: T[]) {
  return {
    areas: areas?.map((a: unknown) => {
      const aa = a as Record<string, unknown>;
      return {
        geometry: aa?.feature
          ? (serializeFeatureGeometry(aa.feature as Feature) as SerializedGeometry | null)
          : null,
        name: aa?.name ?? null,
      };
    }),
  };
}

export function buildKaivuAreasGeometrySnapshot<T = unknown>(areas?: T[]) {
  return {
    areas: areas?.map((a: unknown) => {
      const aa = a as Record<string, unknown>;
      // Kaivuilmoitus stores geometries on nested tyoalueet[].openlayersFeature
      if (Array.isArray(aa?.tyoalueet)) {
        const tyoalueet = (aa.tyoalueet as Array<Record<string, unknown>>).map((ta) => {
          const feature = (ta.openlayersFeature ?? ta.feature) as Feature | undefined | null;
          return (
            (serializeFeatureGeometry(feature as Feature) as SerializedGeometry | null) ?? null
          );
        });
        return {
          // include name for UI restore
          name: aa?.name ?? null,
          // include nested tyoalueet geometries
          tyoalueet,
        };
      }

      // Fallback: single-feature area shape (Johtoselvitys style)
      return {
        geometry: aa?.feature
          ? (serializeFeatureGeometry(aa.feature as Feature) as SerializedGeometry | null)
          : null,
        name: aa?.name ?? null,
      };
    }),
  };
}

export function hydrateJohtoAreasGeometryAfterHydrate(
  raw: unknown,
  formContext: FormContextLike,
  options: { pathPrefix?: string; snapshotKey?: string } = {},
) {
  const { pathPrefix = 'applicationData.areas', snapshotKey = 'areas' } = options;
  hydrateArrayGeometry({ raw, formContext, pathPrefix, snapshotKey }, (entry, idx, currentItem) => {
    const en = entry as Record<string, unknown>;
    if (!en?.geometry) return;
    const geom = deserializeGeometry(en.geometry as SerializedGeometry | null);
    if (!geom) return;
    const existing: Feature<Geometry> =
      (currentItem.feature as Feature<Geometry>) ?? new Feature<Geometry>();
    existing.setGeometry(geom);
    formContext.setValue(`${pathPrefix}.${idx}.feature`, existing, { shouldDirty: false });
  });
}

export function hydrateKaivuAreasGeometryAfterHydrate(
  raw: unknown,
  formContext: FormContextLike,
  options: { pathPrefix?: string; snapshotKey?: string } = {},
) {
  const { pathPrefix = 'applicationData.areas', snapshotKey = 'areas' } = options;
  hydrateArrayGeometry({ raw, formContext, pathPrefix, snapshotKey }, (entry, idx, currentItem) => {
    const en = entry as Record<string, unknown>;
    // Ensure nuisance control plan object exists so validation & UI fields persist
    const hasPlan = (currentItem as Record<string, unknown>).haittojenhallintasuunnitelma;
    if (!hasPlan) {
      formContext.setValue(
        `${pathPrefix}.${idx}.haittojenhallintasuunnitelma`,
        {},
        {
          shouldDirty: false,
        },
      );
    }
    if (Array.isArray(en?.tyoalueet)) {
      const tyoalueSerials = en.tyoalueet as Array<SerializedGeometry | null>;
      tyoalueSerials.forEach((ts, j) => {
        if (!ts) return;
        const geom = deserializeGeometry(ts);
        if (!geom) return;
        const tyoalueet = (currentItem as unknown as Record<string, unknown>).tyoalueet as
          | Array<Record<string, unknown>>
          | undefined;
        const nestedTyoalue = tyoalueet?.[j];
        const existing: Feature<Geometry> =
          (nestedTyoalue?.openlayersFeature as Feature<Geometry>) ?? new Feature<Geometry>();
        existing.setGeometry(geom);
        formContext.setValue(`${pathPrefix}.${idx}.tyoalueet.${j}.openlayersFeature`, existing, {
          shouldDirty: false,
        });
      });
      return; // handled nested case
    }
    if (!en?.geometry) return;
    const geom = deserializeGeometry(en.geometry as SerializedGeometry | null);
    if (!geom) return;
    const existing: Feature<Geometry> =
      (currentItem.feature as Feature<Geometry>) ?? new Feature<Geometry>();
    existing.setGeometry(geom);
    formContext.setValue(`${pathPrefix}.${idx}.feature`, existing, { shouldDirty: false });
  });
}

export function buildHankeAlueetGeometrySnapshot<T = unknown>(alueet?: T[]) {
  return {
    alueet: (alueet || []).map((a: unknown) => {
      const aa = a as Record<string, unknown>;
      return {
        id: aa?.id ?? null,
        geometry: aa?.feature
          ? (serializeFeatureGeometry(aa.feature as Feature) as SerializedGeometry | null)
          : null,
        name: aa?.nimi ?? null,
      };
    }),
  };
}

export function hydrateHankeAlueetGeometryAfterHydrate(
  raw: unknown,
  formContext: FormContextLike,
  options: { pathPrefix?: string; snapshotKey?: string } = {},
) {
  const { pathPrefix = 'alueet', snapshotKey = 'alueet' } = options;
  hydrateArrayGeometry({ raw, formContext, pathPrefix, snapshotKey }, (entry, idx, currentItem) => {
    const en = entry as Record<string, unknown>;
    if (!en?.geometry) return;
    const geom = deserializeGeometry(en.geometry as SerializedGeometry | null);
    if (!geom) return;
    const existing: Feature<Geometry> =
      (currentItem.feature as Feature<Geometry>) ?? new Feature<Geometry>();
    existing.setGeometry(geom);
    formContext.setValue(`${pathPrefix}.${idx}.feature`, existing, { shouldDirty: false });
    // Reconstruct minimal geometriat.featureCollection if missing so consumers relying on server shape still work
    const currentGeometriat = (currentItem as unknown as { geometriat?: Record<string, unknown> })
      .geometriat;
    if (!currentGeometriat || !currentGeometriat.featureCollection) {
      const fc = serializeFeatureGeometry(existing) as SerializedGeometry | null; // single geometry
      const hankeGeoJSON = fc
        ? {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: fc,
                properties: {},
              },
            ],
          }
        : { type: 'FeatureCollection', features: [] };
      // Avoid marking dirty – this mirrors server-provided structure.
      formContext.setValue(
        `${pathPrefix}.${idx}.geometriat`,
        { featureCollection: hankeGeoJSON },
        { shouldDirty: false },
      );
    }
  });
}

export function areasInclude(
  areas: Array<Record<string, unknown>> | null,
  area: Record<string, unknown>,
) {
  if (!areas) return false;
  const target = area as Record<string, unknown>;
  return areas.some((a) => {
    const aa = a as Record<string, unknown>;
    return aa.hankealueId === target.hankealueId;
  });
}
