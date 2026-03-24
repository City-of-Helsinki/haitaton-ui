// Utility helpers for resilient form field queries in tests.
// Focus: Avoid brittle index-based access to repeated 'Tyyppi' (type) comboboxes.
// Strategy: Prefer scoping by participant section heading (e.g. 'Asiakas', 'Urakoitsija', 'Edustaja', 'Rakennuttaja').
// Falls back to role/name search, then data-testid matching.

import { screen, within, waitFor } from '@testing-library/react';

export interface TypeSelectQueryOptions {
  sectionLabel?: RegExp | string; // e.g. /Asiakas/i
  typeLabel?: RegExp; // default /Tyyppi/i
  occurrence?: number; // fallback nth match if multiple remain
  debugOnFail?: boolean; // include DOM dump on failure
}

// Attempts to locate a single combobox representing a participant 'type' selector.
export function findTypeSelect(opts: TypeSelectQueryOptions = {}) {
  const { sectionLabel, typeLabel = /tyyppi/i, occurrence, debugOnFail = false } = opts;

  // 1. If sectionLabel provided, narrow search region to a landmark / heading container including that text.
  let scoped: HTMLElement | undefined;
  if (sectionLabel) {
    // Try heading first
    const sectionPattern =
      typeof sectionLabel === 'string' ? new RegExp(sectionLabel, 'i') : sectionLabel;
    const heading = screen
      .queryAllByRole('heading')
      .find((h) => sectionPattern.test(h.textContent || ''));
    if (heading) {
      // Use nearest section/fieldset/div wrapper heuristics
      scoped =
        heading.closest('section') ||
        heading.closest('fieldset') ||
        heading.parentElement ||
        undefined;
    }
  }

  const queryRoot = scoped || document.body;

  // 2. Collect all comboboxes with accessible name matching typeLabel within scoped root
  let all = within(queryRoot).queryAllByRole('combobox', { name: typeLabel });

  // If scoping was requested but produced no matches, fallback to document-wide search
  if (all.length === 0 && sectionLabel) {
    all = screen.queryAllByRole('combobox', { name: typeLabel });
  }

  if (all.length === 1 && occurrence === undefined) {
    return all[0];
  }

  if (all.length > 1) {
    if (occurrence !== undefined) {
      if (occurrence >= 0 && occurrence < all.length) {
        return all[occurrence];
      }
      throw new Error(
        `findTypeSelect: occurrence ${occurrence} out of bounds (found ${all.length}). Names: ${all
          .map(
            (el) =>
              el.getAttribute('aria-label') ||
              el.getAttribute('name') ||
              el.textContent ||
              '<no-label>',
          )
          .join(' | ')}`,
      );
    }
    // Try to further filter by presence of data-testid attribute patterns (future extension)
  }

  if (all.length === 0) {
    // 3. Fallback: search for input/select elements with label text including typeLabel inside the section.
    const labelMatches = Array.from(queryRoot.querySelectorAll('label'))
      .filter((l) => typeLabel.test(l.textContent || ''))
      .map((l) => {
        const forId = l.getAttribute('for');
        return forId ? document.getElementById(forId) : l.querySelector('select,input');
      })
      .filter(Boolean) as HTMLElement[];
    if (labelMatches.length === 1) return labelMatches[0];
    if (labelMatches.length > 1 && occurrence !== undefined && occurrence < labelMatches.length) {
      return labelMatches[occurrence];
    }
    if (debugOnFail) {
      console.log('findTypeSelect debug: DOM snapshot', queryRoot.innerHTML.slice(0, 3000));
    }
    const locationHint = sectionLabel ? ` within section ${String(sectionLabel)}` : '';
    throw new Error(
      `findTypeSelect: Unable to locate combobox with name matching ${typeLabel}${locationHint}`,
    );
  }

  // Ambiguous case with multiple matches and no explicit occurrence: return first but warn.

  console.warn(
    `findTypeSelect: multiple (${all.length}) matches for ${typeLabel}; returning first. Provide occurrence to disambiguate.`,
  );
  return all[0];
}

// Async variant that waits for the combobox(es) to appear before delegating to the sync helper.
export async function findTypeSelectAsync(opts: TypeSelectQueryOptions = {}, waitMs = 3000) {
  const deadline = Date.now() + waitMs;
  let lastErr: unknown;
  while (Date.now() < deadline) {
    try {
      return findTypeSelect(opts);
    } catch (e) {
      lastErr = e;
      // small delay

      await new Promise((r) => setTimeout(r, 50));
    }
  }
  // One final attempt inside waitFor to surface better RTL error messaging
  try {
    await waitFor(
      () => {
        const el = findTypeSelect(opts);
        if (!el) throw new Error('Still not found');
      },
      { timeout: waitMs },
    );
    return findTypeSelect(opts); // found
  } catch (e) {
    throw lastErr || e;
  }
}
