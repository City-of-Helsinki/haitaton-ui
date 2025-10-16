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
    const placeholders = persisted.map(() => ({}) as Record<string, unknown>);
    // Set the value in form state (asynchronously applied by react-hook-form) but also retain
    // a local reference so we can proceed with geometry hydration synchronously within the same tick.
    formContext.setValue(pathPrefix, placeholders, { shouldDirty: false });
    currentArr = placeholders;
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
  const snapshot = {
    areas: areas?.map((a: unknown) => {
      const aa = a as Record<string, unknown>;
      // Kaivuilmoitus stores geometries on nested tyoalueet[].openlayersFeature
      if (Array.isArray(aa?.tyoalueet)) {
        const tyoalueet = (aa.tyoalueet as Array<Record<string, unknown>>).map((ta) => {
          const feature = (ta.openlayersFeature ?? ta.feature) as Feature | undefined | null;
          // Fallback order:
          // 1. Existing feature/openlayersFeature geometry serialized
          // 2. Raw geometry object already persisted in form state (ta.geometry) if feature not yet built
          // This ensures newly added tyoalueet whose openlayersFeature is constructed lazily after
          // initial snapshot are still captured so they can be rehydrated on language change.
          const serializedFromFeature = feature
            ? (serializeFeatureGeometry(feature as Feature) as SerializedGeometry | null)
            : null;
          if (serializedFromFeature) return serializedFromFeature;
          const rawGeom = ta.geometry as
            | { type?: string; coordinates?: unknown; crs?: unknown }
            | undefined;
          if (rawGeom && rawGeom.type && rawGeom.coordinates) {
            return {
              type: rawGeom.type as string,
              coordinates: rawGeom.coordinates as unknown[],
            } as SerializedGeometry;
          }
          return null;
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
  return snapshot;
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
      // Ensure placeholder array exists so we can set nested indices even if area was newly added
      const existingTyoalueet = (currentItem as unknown as Record<string, unknown>).tyoalueet as
        | Array<Record<string, unknown>>
        | undefined;
      if (!Array.isArray(existingTyoalueet) || existingTyoalueet.length < tyoalueSerials.length) {
        formContext.setValue(
          `${pathPrefix}.${idx}.tyoalueet`,
          Array.from({ length: tyoalueSerials.length }, () => ({})),
          { shouldDirty: false },
        );
      }
      tyoalueSerials.forEach((ts, j) => {
        // ts may be null if snapshot didn't capture a feature yet. Fallback: try raw geometry in persisted areas array.
        let geom: Geometry | null = null;
        if (ts) {
          geom = deserializeGeometry(ts);
        } else {
          // raw persisted object path: applicationData.areas[idx].tyoalueet[j].geometry
          // We purposely read from current form state (which already merged lightweight areas representation) if available.
          const currentRaw = (currentItem as Record<string, unknown>).tyoalueet as
            | Array<Record<string, unknown>>
            | undefined;
          const rawObj = currentRaw?.[j]?.geometry as
            | { type?: string; coordinates?: unknown }
            | undefined;
          // Accept only simple GeoJSON-like structure
          if (rawObj && rawObj.type && rawObj.coordinates) {
            try {
              const sanitized: SerializedGeometry = {
                type: rawObj.type as string,
                coordinates: rawObj.coordinates as unknown[],
              };
              geom = deserializeGeometry(sanitized);
            } catch {
              geom = null;
            }
          }
          // Secondary fallback: read directly from raw persisted payload in case array merge skipped
          if (!geom) {
            try {
              if (raw && typeof raw === 'object') {
                const rawObjRoot = raw as Record<string, unknown>;
                const appData = rawObjRoot.applicationData as Record<string, unknown> | undefined;
                const rawAreas = appData?.areas as Array<Record<string, unknown>> | undefined;
                const rawArea = rawAreas?.[idx];
                const rawTyoalueet = rawArea?.tyoalueet as
                  | Array<Record<string, unknown>>
                  | undefined;
                const rawTyoalueGeom = rawTyoalueet?.[j]?.geometry as
                  | { type?: string; coordinates?: unknown }
                  | undefined;
                if (rawTyoalueGeom && rawTyoalueGeom.type && rawTyoalueGeom.coordinates) {
                  const sanitized: SerializedGeometry = {
                    type: rawTyoalueGeom.type as string,
                    coordinates: rawTyoalueGeom.coordinates as unknown[],
                  };
                  geom = deserializeGeometry(sanitized);
                }
              }
            } catch {
              // ignore
            }
          }
        }
        if (!geom) return; // still nothing to hydrate
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
        // If the nested tyoalue.geometry object is missing or has empty coordinates placeholder, reconstruct it
        const existingGeometryObj = nestedTyoalue?.geometry as
          | { type?: unknown; coordinates?: unknown; crs?: unknown }
          | undefined;
        const serialized = serializeFeatureGeometry(existing);
        if (
          serialized &&
          (!existingGeometryObj ||
            !existingGeometryObj.coordinates ||
            (Array.isArray(existingGeometryObj.coordinates) &&
              existingGeometryObj.coordinates.length === 0))
        ) {
          formContext.setValue(
            `${pathPrefix}.${idx}.tyoalueet.${j}.geometry`,
            {
              type: serialized.type,
              coordinates: serialized.coordinates,
              crs: { type: 'name' }, // minimal CRS structure to satisfy validation schema
            },
            { shouldDirty: false },
          );
        }
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

  // Repair pass: After primary hydration, scan current areas for any nested työalue entries
  // that still lack an openlayersFeature but have a raw geometry object. Construct features
  // so downstream UI (tables, maps) can rely on feature presence even if snapshot merging or
  // timing prevented the earlier handler from setting them.
  //
  // Timing note:
  // React Hook Form may defer applying setValue calls that create the nested arrays for
  // applicationData.areas / tyoalueet until after this hydration function yields. In that case
  // the first geometry assignment loop above sees zero or incomplete placeholders and cannot
  // attach Features. This repair pass (plus a secondary container-level effect in
  // KaivuilmoitusContainer) re-scans once placeholders exist and reconstructs any missing
  // openlayersFeature instances from the persisted raw geometry objects. Keeping this pass
  // inexpensive (simple loops, no allocations beyond features) ensures negligible cost while
  // eliminating a subtle race that previously caused geometry loss after language change.
  try {
    const areas = formContext.getValues(pathPrefix) as unknown;
    if (Array.isArray(areas)) {
      areas.forEach((area, i) => {
        const a = area as Record<string, unknown>;
        const tyoalueet = a.tyoalueet as Array<Record<string, unknown>> | undefined;
        if (!Array.isArray(tyoalueet)) return;
        tyoalueet.forEach((ta, j) => {
          const hasFeature = !!ta.openlayersFeature;
          // Accept geometry objects with type + coordinates properties
          const rawGeom = ta.geometry as { type?: string; coordinates?: unknown } | undefined;
          if (!hasFeature && rawGeom && rawGeom.type && rawGeom.coordinates) {
            try {
              const sanitized: SerializedGeometry = {
                type: rawGeom.type as string,
                coordinates: rawGeom.coordinates as unknown[],
              };
              const deserialized = deserializeGeometry(sanitized);
              if (deserialized) {
                const feature = new Feature<Geometry>();
                feature.setGeometry(deserialized);
                formContext.setValue(
                  `${pathPrefix}.${i}.tyoalueet.${j}.openlayersFeature`,
                  feature,
                  { shouldDirty: false },
                );
              }
            } catch {
              // ignore individual failures
            }
          }
        });
      });
    } else {
      // Fallback: form areas not yet materialized (react-hook-form may batch apply setValue after our effect).
      // Derive from raw persisted payload directly.
      if (raw && typeof raw === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawObj: any = raw;
        const persistedAreas = rawObj?.applicationData?.areas as
          | Array<Record<string, unknown>>
          | undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
        const geomSnapshot: any = rawObj?.__geometry;
        const geomAreas = Array.isArray(geomSnapshot?.areas) ? geomSnapshot.areas : [];
        if (Array.isArray(persistedAreas) && persistedAreas.length) {
          // Ensure areas array exists in form with proper length
          formContext.setValue(
            pathPrefix,
            persistedAreas.map(() => ({})),
            { shouldDirty: false },
          );
          persistedAreas.forEach((pa, i) => {
            const persistedTyoalueet =
              (pa.tyoalueet as Array<Record<string, unknown>> | undefined) ?? [];
            if (persistedTyoalueet.length) {
              formContext.setValue(
                `${pathPrefix}.${i}.tyoalueet`,
                persistedTyoalueet.map(() => ({})),
                { shouldDirty: false },
              );
            }
            persistedTyoalueet.forEach((pta, j) => {
              const rawGeom = pta.geometry as { type?: string; coordinates?: unknown } | undefined;
              const snapshotGeom = geomAreas?.[i]?.tyoalueet?.[j];
              const candidate = rawGeom || snapshotGeom;
              if (candidate && candidate.type && candidate.coordinates) {
                try {
                  const sanitized: SerializedGeometry = {
                    type: candidate.type as string,
                    coordinates: candidate.coordinates as unknown[],
                  };
                  const deserialized = deserializeGeometry(sanitized);
                  if (deserialized) {
                    const feature = new Feature<Geometry>();
                    feature.setGeometry(deserialized);
                    formContext.setValue(
                      `${pathPrefix}.${i}.tyoalueet.${j}.openlayersFeature`,
                      feature,
                      { shouldDirty: false },
                    );
                    formContext.setValue(
                      `${pathPrefix}.${i}.tyoalueet.${j}.geometry`,
                      {
                        type: sanitized.type,
                        coordinates: sanitized.coordinates,
                        crs: { type: 'name' },
                      },
                      { shouldDirty: false },
                    );
                  }
                } catch {
                  // ignore
                }
              }
            });
          });
        }
      }
    }
  } catch {
    // ignore repair errors
  }
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
