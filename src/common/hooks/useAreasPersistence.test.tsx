import React from 'react';
import { render } from '../../testUtils/render';
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

// Note: __geometry snapshot is no longer persisted; related regression tests removed.
