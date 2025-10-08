import React from 'react';
import { render, waitFor } from '../../testUtils/render';
import { useForm } from 'react-hook-form';
import useAreasPersistence from './useAreasPersistence';

type JohtoFormValues = {
  applicationData: {
    areas?: unknown[];
    name?: string;
    workDescription?: string;
    constructionWork?: boolean;
    maintenanceWork?: boolean;
    emergencyWork?: boolean;
    rockExcavation?: boolean;
    startTime?: string;
    endTime?: string;
    customerWithContacts?: {
      customer?: { [key: string]: unknown };
      contacts?: Array<{ [key: string]: unknown }>;
    };
  };
};

type KaivuFormValues = {
  applicationData: {
    areas?: unknown[];
    name?: string;
    // Kaivu-specific nested shape omitted — only type distinction matters here
  };
};

function JohtoConsumer() {
  const form = useForm<JohtoFormValues>({ defaultValues: { applicationData: {} } });
  // compile-time: ensures useAreasPersistence accepts UseFormReturn<JohtoFormValues>
  useAreasPersistence('test-johto', form, { type: 'JOHTO' });
  return null;
}

function KaivuConsumer() {
  const form = useForm<KaivuFormValues>({ defaultValues: { applicationData: {} } });
  // compile-time: ensures useAreasPersistence accepts UseFormReturn<KaivuFormValues>
  useAreasPersistence('test-kaivu', form, { type: 'KAIVU' });
  return null;
}

test('useAreasPersistence accepts Johto form shape', () => {
  render(<JohtoConsumer />);
});

test('useAreasPersistence accepts Kaivu form shape', () => {
  render(<KaivuConsumer />);
});

test('persists __geometry under reserved key on language change', async () => {
  const defaultValues = {
    applicationData: {
      name: 'Initial',
      areas: [
        { id: 1, name: 'A1', feature: null },
        { id: 2, name: 'A2', feature: null },
      ],
    },
  };

  function Consumer() {
    const form = useForm({ defaultValues });
    useAreasPersistence('test-areas-key', form, { type: 'JOHTO' });
    return null;
  }

  sessionStorage.removeItem('test-areas-key');
  render(<Consumer />);

  // allow effects (listener registration) to run
  await new Promise((r) => setTimeout(r, 0));

  // Force immediate snapshot via languageChanging event
  window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));

  // Wait for item to appear
  await waitFor(() => expect(sessionStorage.getItem('test-areas-key')).toBeTruthy());

  const parsed = JSON.parse(sessionStorage.getItem('test-areas-key') as string);
  expect(parsed.applicationData).toBeTruthy();
  expect(parsed['__geometry']).toBeTruthy();
  expect(Array.isArray(parsed['__geometry'].areas)).toBe(true);
});
