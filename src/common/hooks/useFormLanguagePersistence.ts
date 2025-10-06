import { useEffect, useRef, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import debounce from 'lodash/debounce';

/**
 * Persist react-hook-form values to sessionStorage so that navigation that unmounts the form
 * (e.g. language change causing route change) does not lose unsaved draft edits.
 *
 * Hydration logic:
 *  - Runs only once on mount.
 *  - Restores persisted values if form is not dirty (prevents overwriting freshly loaded server data).
 *
 * Persistence logic:
 *  - Watches form values and (debounced) stores them as JSON.
 *  - Failures (e.g. quota) are silently ignored.
 */
// T can be any form value shape used by react-hook-form
// We purposefully don't constrain to Record<string, unknown> because many form value
// interfaces have no index signature. We only require it to be object-like for merging.
export default function useFormLanguagePersistence<T extends object>(
  storageKey: string,
  form: UseFormReturn<T>,
  options: {
    enabled?: boolean;
    clearOnUnmount?: boolean;
    select?: (values: T) => unknown; // pick lightweight subset to persist
    debounceMs?: number;
    afterHydrate?: (rawPersisted: unknown) => void; // hook for extra side-effects (e.g. geometry rehydration)
  } = {},
) {
  const {
    enabled = true,
    clearOnUnmount = false,
    select,
    debounceMs = 300,
    afterHydrate,
  } = options;
  const { watch, getValues, formState } = form;
  const hydratedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof debounce>>();
  const seenDuringSave = useRef<WeakSet<object> | null>(null);

  const safeStringify = useCallback((value: unknown) => {
    seenDuringSave.current = new WeakSet();
    try {
      return JSON.stringify(value, (k, v) => {
        // Exclude OpenLayers Feature instances (non-serializable) so original instances from defaults remain.
        if (k === 'feature') return undefined;
        if (typeof v === 'function' || typeof v === 'symbol') return undefined;
        if (v instanceof File || v instanceof Blob) return undefined;
        if (typeof v === 'object' && v !== null) {
          const obj = v as object;
          if (seenDuringSave.current!.has(obj)) return undefined; // circular
          // Filter out objects that clearly won't serialize meaningfully (OpenLayers internal objects etc.)
          const ctor = (obj as unknown as { constructor?: { name?: string } }).constructor?.name;
          if (ctor && /^(VectorSource|Source|EventTarget)$/i.test(ctor)) return undefined;
          seenDuringSave.current!.add(obj);
        }
        return v;
      });
    } catch {
      return undefined;
    } finally {
      seenDuringSave.current = null;
    }
  }, []);

  const saveSnapshot = useCallback(() => {
    if (!enabled) return;
    try {
      const allValues = getValues();
      const persistable = (select ? select(allValues as T) : allValues) as unknown;
      const json = safeStringify(persistable);
      if (json) {
        sessionStorage.setItem(storageKey, json);
      }
    } catch {
      // ignore
    }
  }, [enabled, getValues, safeStringify, storageKey, select]);

  // Hydrate once. Previous implementation skipped hydration entirely if formState.isDirty.
  // However some containers (e.g. Kaivuilmoitus BasicInfo) mark unrelated fields dirty via
  // programmatic setValue effects before this hook runs, blocking hydration. We now apply
  // persisted values field-by-field for paths that are still pristine (not in dirtyFields),
  // even if the overall form isDirty.
  // helper utilities for selective hydration
  type DirtyTree = Record<string, unknown> | true | undefined;
  /**
   * Determine whether a specific form path (segments) is considered dirty.
   *
   * Semantics and rationale:
   *  - Return true only when the exact path has been marked dirty (node === true).
   *  - Do NOT treat an ancestor being marked `true` as making all descendants dirty.
   *    Ancestor-true means "the ancestor value has been changed", but that should not
   *    automatically prevent hydrating unrelated nested children which may still be
   *    pristine and safe to restore from persisted snapshot.
   *
   * Example dirty trees and behavior:
   *  - dirty = { a: true }
   *      pathIsDirty(dirty, ['a'])      -> true
   *      pathIsDirty(dirty, ['a','b'])  -> false  (allow hydrate a.b)
   *  - dirty = { a: { b: true } }
   *      pathIsDirty(dirty, ['a'])      -> false
   *      pathIsDirty(dirty, ['a','b'])  -> true
   *  - dirty = true
   *      pathIsDirty(dirty, ['a'])      -> false  (we treat ancestor-true as non-blocking)
   *
   * Note: array indices should be represented as string segments (e.g. ['contacts','0','name']).
   * This function focuses on conservative, predictable hydration: only exact-path dirty
   * flags block hydration; everything else is eligible for re-application from storage.
   */
  function pathIsDirty(dirty: DirtyTree, segments: string[]): boolean {
    let node: DirtyTree = dirty;
    for (const seg of segments) {
      // If the branch is missing or flagged as a generic `true` at an ancestor level,
      // we DO NOT treat the deeper path as dirty. This intentionally allows applying
      // persisted nested values when a parent container was marked dirty programmatically.
      if (!node || node === true) return false;
      node = (node as Record<string, unknown>)[seg] as DirtyTree;
    }
    return node === true;
  }
  function applyPersisted(
    setValueFn: (path: string, value: unknown, opts?: { shouldDirty?: boolean }) => void,
    dirty: DirtyTree,
    prefix: string[],
    value: unknown,
  ) {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      if (!pathIsDirty(dirty, prefix)) {
        setValueFn(prefix.join('.'), value, { shouldDirty: false });
      }
      return;
    }
    Object.entries(value as Record<string, unknown>).forEach(([k, v]) =>
      applyPersisted(setValueFn, dirty, [...prefix, k], v),
    );
  }

  useEffect(() => {
    if (!enabled || hydratedRef.current) return;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const persisted: unknown = JSON.parse(raw);
        if (persisted && typeof persisted === 'object') {
          const dirtyFields =
            (formState as unknown as { dirtyFields?: DirtyTree }).dirtyFields || {};
          const setValue = (
            form as unknown as {
              setValue: (path: string, value: unknown, opts?: { shouldDirty?: boolean }) => void;
            }
          ).setValue;
          Object.entries(persisted as Record<string, unknown>).forEach(([k, v]) => {
            // Skip internal/meta keys prefixed with __ (reserved for auxiliary persistence like geometry)
            if (k.startsWith('__')) return;

            // For critical server-provided fields, only apply if the current form value is empty/undefined
            // This prevents overwriting server data with stale persisted values
            if (k === 'hankeTunnus') {
              const currentValue = (
                form as unknown as { getValues: (field: string) => unknown }
              ).getValues('hankeTunnus');
              if (currentValue && currentValue !== v) {
                // Current form has a different hankeTunnus, don't overwrite with persisted value
                return;
              }
            }

            applyPersisted(setValue, dirtyFields, [k], v);
          });
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      hydratedRef.current = true;
      try {
        if (afterHydrate) {
          const raw = sessionStorage.getItem(storageKey);
          // raw already parsed above but re-read to keep logic localized; performance impact negligible
          if (raw) afterHydrate(JSON.parse(raw));
        }
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, storageKey]);

  // Persist on change (debounced)
  useEffect(() => {
    if (!enabled) return;
    const subscription = watch(() => {
      if (!debounceRef.current) {
        debounceRef.current = debounce(
          () => {
            saveSnapshot();
          },
          debounceMs,
          { leading: true, trailing: true, maxWait: 1500 },
        );
      }
      debounceRef.current();
    });
    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) {
        debounceRef.current.flush();
      }
    };
  }, [enabled, watch, saveSnapshot, debounceMs]);

  // Listen for custom language switching event to snapshot immediately before route change
  useEffect(() => {
    if (!enabled) return;
    const handler = () => saveSnapshot();
    window.addEventListener('haitaton:languageChanging', handler);
    return () => window.removeEventListener('haitaton:languageChanging', handler);
  }, [enabled, saveSnapshot]);

  // Optionally clear on unmount
  useEffect(() => {
    return () => {
      if (clearOnUnmount) {
        try {
          sessionStorage.removeItem(storageKey);
        } catch {
          // ignore
        }
      }
    };
  }, [clearOnUnmount, storageKey]);

  function clearPersisted() {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  return { clearPersisted, saveSnapshot, hydrated: hydratedRef.current };
}
