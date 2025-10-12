/**
 * Kaivuilmoitus domain test helpers
 * ---------------------------------
 * This module centralizes commonly used helper functions for Kaivuilmoitus tests to reduce
 * repetitive multi-path imports and make refactors easier.
 *
 * Exposed categories:
 *  - Rendering & application builders (renderKaivuilmoitus, buildDefaultApplication, buildApplicationForSummary)
 *  - Primitive UI interaction helpers (navigateToStep, selectComboboxOption, expandAccordionByText)
 *  - Data/setup helpers (mockHaittaIndex, uploadTestAttachments, fillInvoicingCustomer)
 *
 * Usage pattern:
 *  import { renderKaivuilmoitus, navigateToStep, mockHaittaIndex } from './kaivuilmoitusTestHelpers';
 *
 * Keep this file focused on Kaivuilmoitus domain needs. Cross-domain generic helpers should
 * remain in testUtils/helpers to avoid tight coupling.
 */
import { cloneDeep } from 'lodash';
import applications from '../mocks/data/hakemukset-data';
import {
  Application,
  KaivuilmoitusData,
  KaivuilmoitusAlue,
} from '../application/types/application';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import { render } from '../../testUtils/render';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import React from 'react';
// Common test helpers used across Kaivuilmoitus domain tests. Re-export them here for convenience.
import { navigateToStep } from '../../testUtils/helpers/navigation';
import { uploadTestAttachments } from '../../testUtils/helpers/uploadTestAttachments';
import { expandAccordionByText } from '../../testUtils/helpers/accordion';
import { mockHaittaIndex } from '../../testUtils/helpers/haittaIndex';
import { selectComboboxOption } from '../../testUtils/helpers/combobox';
import { fillInvoicingCustomer } from '../../testUtils/formHelpers/invoicingCustomer';

export {
  navigateToStep,
  uploadTestAttachments,
  expandAccordionByText,
  mockHaittaIndex,
  selectComboboxOption,
  fillInvoicingCustomer,
};

/**
 * Builds a pre-populated Kaivuilmoitus application suitable for jumping directly to the summary step.
 * It trims extraneous data to reduce render overhead while keeping required fields valid across steps.
 */
export function buildApplicationForSummary(): Application<KaivuilmoitusData> {
  const base = cloneDeep(applications[4]) as Application<KaivuilmoitusData>;
  const data = base.applicationData;
  // Ensure mandatory basic info fields are populated
  data.name = data.name || 'Kaivuilmoitus testi';
  data.workDescription = data.workDescription || 'Testataan yhteenvetosivua';
  data.cableReportDone = true;
  data.cableReports = data.cableReports?.length ? data.cableReports : ['JS2300001'];
  data.placementContracts = data.placementContracts?.length
    ? data.placementContracts
    : ['SL0000001'];
  // Provide dates if absent (string form may suffice in UI formatting)
  data.startTime = data.startTime || new Date('2023-01-13T00:00:00.000Z');
  data.endTime = data.endTime || new Date('2024-11-12T00:00:00.000Z');
  // Trim areas to first two for lighter rendering
  if (Array.isArray(data.areas) && data.areas.length > 2) {
    data.areas = (data.areas as KaivuilmoitusAlue[]).slice(0, 2);
  }
  return base;
}

export function getDefaultHanke(): HankeData {
  return hankkeet[1] as HankeData;
}

/**
 * Render KaivuilmoitusContainer with optional overrides.
 * Centralizes the default hankeData (index 1) and lets callers supply an application override.
 * Returns the render result (including user) for further interactions.
 */
export function renderKaivuilmoitus({
  hankeData,
  application,
}: {
  hankeData?: HankeData;
  application?: Application<KaivuilmoitusData>;
} = {}) {
  const resolvedHankeData = hankeData ?? (hankkeet[1] as HankeData);
  return render(
    React.createElement(KaivuilmoitusContainer, {
      hankeData: resolvedHankeData,
      application,
    }),
  );
}

/**
 * Deep-clone a baseline kaivuilmoitus application and apply optional overrides.
 * By default uses applications[4] which contains representative area data for most tests.
 * Override mechanics:
 *  - top-level fields of Application are shallow merged
 *  - applicationData is merged field-by-field allowing partial customizations
 */
export function buildDefaultApplication({
  baseIndex = 4,
  overrides = {},
  applicationData: appDataOverrides = {},
}: {
  baseIndex?: number;
  overrides?: Partial<Application<KaivuilmoitusData>>;
  applicationData?: Partial<KaivuilmoitusData>;
} = {}): Application<KaivuilmoitusData> {
  const base = cloneDeep(applications[baseIndex]) as Application<KaivuilmoitusData>;
  const mergedAppData: KaivuilmoitusData = {
    ...base.applicationData,
    ...appDataOverrides,
  } as KaivuilmoitusData;
  return {
    ...base,
    ...overrides,
    applicationData: mergedAppData,
  } as Application<KaivuilmoitusData>;
}
