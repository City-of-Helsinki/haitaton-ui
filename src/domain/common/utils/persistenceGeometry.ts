// Clean single implementation for persistence geometry helpers
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
  if (!raw || typeof raw !== 'object') return;
  const rawObj = raw as Record<string, unknown>;
  const geomSectionRaw = rawObj[snapshotKey]
    ? { areas: rawObj[snapshotKey] }
    : (rawObj['__geometry'] as unknown | undefined);
  let persisted: unknown = undefined;
  if (geomSectionRaw && typeof geomSectionRaw === 'object') {
    const gs = geomSectionRaw as Record<string, unknown>;
    persisted = gs.areas ?? geomSectionRaw;
  } else {
    persisted = geomSectionRaw;
  }
  if (!Array.isArray(persisted)) return;
  const current = formContext.getValues(pathPrefix) as unknown;
  if (!Array.isArray(current)) return;
  const currentArr = current as Array<Record<string, unknown>>;
  if (!Array.isArray(persisted)) return;
  persisted.forEach((entry: unknown, idx: number) => {
    const en = entry as Record<string, unknown>;
    if (!en?.geometry) return;
    const geom = deserializeGeometry(en.geometry as SerializedGeometry | null);
    if (!geom) return;
    const existing: Feature<Geometry> =
      (currentArr[idx]?.feature as Feature<Geometry>) ?? new Feature<Geometry>();
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
  if (!raw || typeof raw !== 'object') return;
  const rawObj = raw as Record<string, unknown>;
  const geomSectionRaw = rawObj[snapshotKey]
    ? { areas: rawObj[snapshotKey] }
    : (rawObj['__geometry'] as unknown | undefined);
  let persisted: unknown = undefined;
  if (geomSectionRaw && typeof geomSectionRaw === 'object') {
    const gs = geomSectionRaw as Record<string, unknown>;
    persisted = gs.areas ?? geomSectionRaw;
  } else {
    persisted = geomSectionRaw;
  }
  if (!Array.isArray(persisted)) return;
  const current = formContext.getValues(pathPrefix) as unknown;
  if (!Array.isArray(current)) return;
  const currentArr = current as Array<Record<string, unknown>>;
  persisted.forEach((entry: unknown, idx: number) => {
    const en = entry as Record<string, unknown>;
    if (!en?.geometry) return;
    const geom = deserializeGeometry(en.geometry as SerializedGeometry | null);
    if (!geom) return;
    const existing: Feature<Geometry> =
      (currentArr[idx]?.feature as Feature<Geometry>) ?? new Feature<Geometry>();
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
  if (!raw || typeof raw !== 'object') return;
  const rawObj = raw as Record<string, unknown>;
  const geomSectionRaw = rawObj[snapshotKey]
    ? { alueet: rawObj[snapshotKey] }
    : (rawObj['__geometry'] as unknown | undefined);
  let persisted: unknown = undefined;
  if (geomSectionRaw && typeof geomSectionRaw === 'object') {
    const gs = geomSectionRaw as Record<string, unknown>;
    persisted = gs.alueet ?? geomSectionRaw;
  } else {
    persisted = geomSectionRaw;
  }
  if (!Array.isArray(persisted)) return;
  const current = formContext.getValues(pathPrefix) as unknown;
  if (!Array.isArray(current)) return;
  const currentArr = current as Array<Record<string, unknown>>;
  persisted.forEach((entry: unknown, idx: number) => {
    const en = entry as Record<string, unknown>;
    if (!en?.geometry || !currentArr[idx]) return;
    const geom = deserializeGeometry(en.geometry as SerializedGeometry | null);
    if (!geom) return;
    const existing: Feature<Geometry> =
      (currentArr[idx].feature as Feature<Geometry>) ?? new Feature<Geometry>();
    existing.setGeometry(geom);
    formContext.setValue(`${pathPrefix}.${idx}.feature`, existing, { shouldDirty: false });
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
