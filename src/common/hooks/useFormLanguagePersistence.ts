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
  } = {},
) {
  const { enabled = true, clearOnUnmount = false, select, debounceMs = 300 } = options;
  const { watch, getValues, reset, formState } = form;
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

  // Hydrate once
  useEffect(() => {
    if (!enabled || hydratedRef.current) return;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const persisted: unknown = JSON.parse(raw);
        if (!formState.isDirty && typeof persisted === 'object' && persisted !== null) {
          const current = getValues();
          // Custom merge: for arrays of objects, keep original 'feature' references
          const mergedObj: Record<string, unknown> = { ...(current as Record<string, unknown>) };
          Object.entries(persisted as Record<string, unknown>).forEach(([key, val]) => {
            const existing = mergedObj[key];
            if (Array.isArray(val) && Array.isArray(existing)) {
              mergedObj[key] = val.map((item, idx) => {
                const currentItem = (existing as unknown[])[idx];
                if (
                  item &&
                  typeof item === 'object' &&
                  currentItem &&
                  typeof currentItem === 'object'
                ) {
                  const currentWithFeature = currentItem as { feature?: unknown };
                  return {
                    ...(currentItem as object),
                    ...(item as object),
                    feature: currentWithFeature.feature,
                  };
                }
                return item as unknown;
              });
            } else {
              mergedObj[key] = val;
            }
          });
          reset(mergedObj as T, {
            keepDirty: false,
          });
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      hydratedRef.current = true;
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

  return { clearPersisted, saveSnapshot };
}
