import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { UseFormReturn } from 'react-hook-form';
import debounce from 'lodash/debounce';

/**
 * Persist selected react-hook-form values to sessionStorage so that navigation that unmounts the form
 * (e.g. language change causing route change) does not lose unsaved draft edits.
 *
 * Core responsibilities
 * ---------------------
 * 1. Hydrate previously persisted (subset) values back into a fresh form instance on the next mount.
 * 2. Continuously (debounced) persist changes while the form is mounted so the latest draft survives a language change.
 * 3. Provide safe serialization that strips out obviously non‑serializable or heavy objects (OpenLayers Features, Blobs, functions, circular refs).
 * 4. Allow selective persistence via the `select` option so only a lightweight subset (e.g. textual fields, minimal area metadata) is stored.
 * 5. Support post‑hydration side effects (e.g. geometry reconstruction) through `afterHydrate`.
 *
 * Hydration timing (`hydratePhase`)
 * --------------------------------
 * By default hydration runs in a layout effect (before the first paint) so that UI components relying on
 * persisted values (e.g. newly added Areas rows) render immediately without an intermediate empty state.
 * Some forms (like the Hanke form) perform additional mount‑time `setValue` calls or geometry processing
 * that can cause deep update loops when executed during layout. For those cases switch to `hydratePhase: 'effect'`.
 *
 *  - 'layout' (default):
 *      Pros: No flicker; values available to child components at initial render.
 *      Cons: If the form (or children) synchronously call many `setValue` operations / side-effects on mount,
 *            risk of "maximum update depth" warnings. Use only when mount side-effects are light / idempotent.
 *  - 'effect':
 *      Pros: Mimics original post-paint behaviour; safer for complex mount logic.
 *      Cons: One paint may occur with defaultValues before persisted values appear (possible brief visual gap).
 *
 * Dirty field selective merge
 * ---------------------------
 * The hook replays persisted values field-by-field, skipping any exact paths already marked dirty in
 * react-hook-form's `dirtyFields` tree. Parent nodes marked dirty do NOT block hydration of untouched
 * nested children (intentional so programmatic setValue of a container does not starve deeper persisted edits).
 *
 * Arrays
 * ------
 * Arrays are traversed element-wise. Previously an entire array path marked dirty prevented new indices
 * from hydrating (causing recently added items to disappear). The current algorithm sets the whole array
 * when the path itself is pristine, otherwise it patches only pristine indices.
 *
 * Testing considerations
 * ----------------------
 * - `testMode` disables debouncing and batches hydration to reduce React act() warnings.
 * - You can override timing with `hydratePhase` per test scenario to simulate legacy behaviour.
 *
 * Failure handling
 * ----------------
 * All storage operations are wrapped in try/catch and fail silently (quota exceeded, JSON errors, etc.).
 *
 * Return value
 * ------------
 * `{ clearPersisted, saveSnapshot, hydrated }`
 * - `clearPersisted()`: manual removal of the session snapshot.
 * - `saveSnapshot()`: force an immediate persistence (used before custom navigation events).
 * - `hydrated`: boolean flag indicating hydration attempt has completed (useful for gating late side-effects).
 */
function callAfterHydrate(
  afterHydrate: ((raw: unknown) => void) | undefined,
  storageKey: string,
): void {
  if (!afterHydrate) return;
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = undefined;
    }
    afterHydrate(parsed);
  } catch {
    // ignore
  }
}

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
    testMode?: boolean; // when true, minimize async debounce + batch hydration to reduce act() warnings
    hydratePhase?: 'layout' | 'effect'; // default 'layout' to avoid first-render flicker
  } = {},
) {
  const {
    enabled = true,
    clearOnUnmount = false,
    select,
    debounceMs = 300,
    afterHydrate,
    testMode = false,
    hydratePhase = 'layout',
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
        // Historically geometry features were stored under different property names; strip both common keys.
        if (k === 'feature' || k === 'openlayersFeature') return undefined;
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
      const persistable = select ? select(allValues as T) : allValues;
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
      node = node[seg] as DirtyTree;
    }
    return node === true;
  }
  function applyPersisted(
    setValueFn: (path: string, value: unknown, opts?: { shouldDirty?: boolean }) => void,
    dirty: DirtyTree,
    prefix: string[],
    value: unknown,
  ) {
    // Arrays need special handling: previously they were treated as atomic values which meant
    // a dirty flag on the parent path (e.g. applicationData.areas) blocked updating newly added
    // child indices from the persisted snapshot. We now traverse arrays element-wise while still
    // respecting exact-path dirty semantics. If a specific index path is dirty it will not be
    // overwritten, but pristine indices (including new ones) are safely hydrated.
    if (Array.isArray(value)) {
      if (pathIsDirty(dirty, prefix)) {
        // Parent path dirty; still attempt to hydrate pristine child indices individually.
        const arr = value as unknown[];
        for (const [idx, child] of arr.entries()) {
          const childPath = [...prefix, String(idx)];
          if (!pathIsDirty(dirty, childPath)) {
            setValueFn(childPath.join('.'), child, { shouldDirty: false });
          }
        }
      } else {
        // Ensure array container exists; set once then fill individual pristine indices.
        // We avoid marking dirty to keep form pristine flags correct.
        setValueFn(prefix.join('.'), value, { shouldDirty: false });
      }
      return;
    }
    if (value === null || typeof value !== 'object') {
      if (!pathIsDirty(dirty, prefix)) {
        setValueFn(prefix.join('.'), value, { shouldDirty: false });
      }
      return;
    }
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      applyPersisted(setValueFn, dirty, [...prefix, k], v);
    }
  }

  const useHydrationEffect =
    hydratePhase === 'layout' && globalThis.window !== undefined ? useLayoutEffect : useEffect;

  useHydrationEffect(() => {
    if (!enabled || hydratedRef.current) return;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const persisted: unknown = JSON.parse(raw);
        // Only proceed when persisted root is a plain object. Previous regression:
        // step index persistence overwrote object with a primitive number, causing
        // geometry hydration to silently fail. Guard prevents misleading partial hydration.
        if (persisted && typeof persisted === 'object' && !Array.isArray(persisted)) {
          const dirtyFields =
            (formState as unknown as { dirtyFields?: DirtyTree }).dirtyFields || {};
          const setValue = (
            form as unknown as {
              setValue: (path: string, value: unknown, opts?: { shouldDirty?: boolean }) => void;
            }
          ).setValue;
          const entries = Object.entries(persisted as Record<string, unknown>);
          const applyAll = () => {
            for (const [k, v] of entries) {
              if (k.startsWith('__')) continue;
              if (k === 'hankeTunnus') {
                const currentValue = (
                  form as unknown as { getValues: (field: string) => unknown }
                ).getValues('hankeTunnus');
                if (currentValue && currentValue !== v) {
                  continue;
                }
              }
              applyPersisted(setValue, dirtyFields, [k], v);
            }
          };
          if (testMode) {
            // Batch to single render / act frame in tests to avoid multiple overlapping act warnings
            unstable_batchedUpdates(applyAll);
          } else {
            applyAll();
          }
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      hydratedRef.current = true;
      // Expose hydrated state for components that need to defer side-effects until after persistence hydration
      try {
        Object.defineProperty(form, 'languagePersistenceHydrated', {
          value: true,
          enumerable: false,
          configurable: true,
        });
      } catch {
        // ignore
      }
      // raw already parsed above but re-read to keep logic localized; performance impact negligible
      callAfterHydrate(afterHydrate, storageKey);
    }
  }, [enabled, storageKey, hydratePhase]);

  // Persist on change (debounced unless testMode)
  useEffect(() => {
    if (!enabled) return;
    const subscription = watch(() => {
      if (testMode) {
        // immediate save to keep deterministic in tests
        saveSnapshot();
        return;
      }
      debounceRef.current ??= debounce(
        () => {
          saveSnapshot();
        },
        debounceMs,
        { leading: true, trailing: true, maxWait: 1500 },
      );
      debounceRef.current();
    });
    return () => {
      subscription.unsubscribe();
      if (debounceRef.current && !testMode) {
        debounceRef.current.flush();
      }
    };
  }, [enabled, watch, saveSnapshot, debounceMs, testMode]);

  // Listen for custom language switching event to snapshot immediately before route change
  useEffect(() => {
    if (!enabled) return;
    const handler = () => {
      // Flush any pending debounced save first so we don't lose the most recent partial write
      if (debounceRef.current) {
        try {
          debounceRef.current.flush();
        } catch {
          // ignore
        }
      }
      // Perform an immediate synchronous snapshot – critical for tests that dispatch the
      // language change event and unmount in the same act() tick.
      saveSnapshot();
      // Schedule a microtask follow-up in case any final synchronous setValue calls occur
      // inside other language change listeners after ours.
      Promise.resolve().then(() => {
        saveSnapshot();
      });
    };
    if (globalThis.window !== undefined) {
      globalThis.window.addEventListener('haitaton:languageChanging', handler);
      return () => globalThis.window.removeEventListener('haitaton:languageChanging', handler);
    }
    return () => {};
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

  function getPersisted() {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return undefined;
      return JSON.parse(raw);
    } catch {
      return undefined;
    }
  }

  return { clearPersisted, saveSnapshot, hydrated: hydratedRef.current, getPersisted };
}
