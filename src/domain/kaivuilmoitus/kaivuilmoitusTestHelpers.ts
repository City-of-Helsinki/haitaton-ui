import { cloneDeep } from 'lodash';
import applications from '../mocks/data/hakemukset-data';
import {
  Application,
  KaivuilmoitusData,
  KaivuilmoitusAlue,
} from '../application/types/application';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';

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
 * Navigate to a target step using stepper button text (e.g. Vaihe 6/6) if present.
 * Falls back to sequential 'Seuraava' clicks if direct step navigation is blocked.
 */
// Re-export shared helper for backward compatibility with existing imports in domain tests.
