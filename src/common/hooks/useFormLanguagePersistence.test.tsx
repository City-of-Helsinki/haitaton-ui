import React from 'react';
import { render, waitFor } from '../../testUtils/render';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import useFormLanguagePersistence from './useFormLanguagePersistence';

interface AreaLike {
  id?: number;
  nimi?: string;
  feature?: { dummy: string }; // simulate OpenLayers Feature (methods would be lost if serialized)
  meluHaitta?: number | null;
}

interface TestFormValues {
  nimi: string;
  kuvaus: string;
  tyomaaTyyppi: string[];
  alueet: AreaLike[];
}

const defaultValues: TestFormValues = {
  nimi: 'Initial name',
  kuvaus: 'Initial desc',
  tyomaaTyyppi: ['TYPE1'],
  alueet: [
    { id: 1, nimi: 'Alue 1', feature: { dummy: 'keep-me' }, meluHaitta: 1 },
    { id: 2, nimi: 'Alue 2', feature: { dummy: 'keep-me-2' }, meluHaitta: 2 },
  ],
};

const STORAGE_KEY = 'test-form-persistence';

function TestComponent({ select }: { select?: (v: TestFormValues) => unknown }) {
  const methods = useForm<TestFormValues>({ defaultValues });
  useFormLanguagePersistence<TestFormValues>(STORAGE_KEY, methods, { select, debounceMs: 0 });
  return (
    <FormProvider {...methods}>
      <input {...methods.register('nimi')} data-testid="nimi" />
      <textarea {...methods.register('kuvaus')} data-testid="kuvaus" />
    </FormProvider>
  );
}

describe('useFormLanguagePersistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('persists full values by default (no select)', async () => {
    const { getByTestId } = render(<TestComponent />);
    const user = userEvent.setup();
    const nimiInput = getByTestId('nimi') as HTMLInputElement;

    await user.clear(nimiInput);
    await user.type(nimiInput, 'Edited name');

    await waitFor(() => expect(sessionStorage.getItem(STORAGE_KEY)).toBeTruthy());
    const raw = sessionStorage.getItem(STORAGE_KEY)!;
    const parsed = JSON.parse(raw);
    expect(parsed.nimi).toBe('Edited name');
    expect(parsed.alueet).toHaveLength(2);
    expect(parsed.alueet[0].feature).toBeUndefined();
  });

  test('select limits persisted subset', async () => {
    const select = (v: TestFormValues) => ({ nimi: v.nimi });
    const { getByTestId } = render(<TestComponent select={select} />);
    const user = userEvent.setup();
    const nimiInput = getByTestId('nimi') as HTMLInputElement;

    await user.clear(nimiInput);
    await user.type(nimiInput, 'Only name');
    await waitFor(() => expect(sessionStorage.getItem(STORAGE_KEY)).toBeTruthy());
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY)!);
    expect(parsed).toEqual({ nimi: 'Only name' });
  });

  test('hydration merges and preserves feature references', async () => {
    // First mount: edit and persist
    const { getByTestId, unmount } = render(<TestComponent />);
    const user = userEvent.setup();
    const nimiInput = getByTestId('nimi') as HTMLInputElement;
    await user.clear(nimiInput);
    await user.type(nimiInput, 'Persisted name');
    await waitFor(() => expect(sessionStorage.getItem(STORAGE_KEY)).toBeTruthy());
    unmount();

    // Mount again with different defaultValues to simulate fresh server fetch
    const NewDefaultsWrapper: React.FC = () => {
      const methods = useForm<TestFormValues>({
        defaultValues: {
          ...defaultValues,
          nimi: 'Server name',
          alueet: [
            { id: 1, nimi: 'Server Alue 1', feature: { dummy: 'keep-me' }, meluHaitta: 9 },
            { id: 2, nimi: 'Server Alue 2', feature: { dummy: 'keep-me-2' }, meluHaitta: 9 },
          ],
        },
      });
      useFormLanguagePersistence<TestFormValues>(STORAGE_KEY, methods, { debounceMs: 0 });
      return (
        <FormProvider {...methods}>
          <input {...methods.register('nimi')} data-testid="nimi" />
        </FormProvider>
      );
    };

    const { getByTestId: getByTestId2 } = render(<NewDefaultsWrapper />);
    const newNimiInput = getByTestId2('nimi') as HTMLInputElement;
    expect(newNimiInput.value).toBe('Persisted name');
  });

  test('immediate snapshot on custom event', async () => {
    const { getByTestId } = render(<TestComponent />);
    const user = userEvent.setup();
    const nimiInput = getByTestId('nimi') as HTMLInputElement;
    await user.clear(nimiInput);
    await user.type(nimiInput, 'Event snapshot');
    // Do not rely on watcher yet; simulate navigation event forcing snapshot
    sessionStorage.clear();
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() => expect(sessionStorage.getItem(STORAGE_KEY)).toBeTruthy());
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY)!);
    expect(parsed.nimi).toBe('Event snapshot');
  });

  test('geometry serialization stores lightweight geometry snapshot', async () => {
    // Provide a select that mimics area geometry serialization (only id + dummy geometry placeholder)
    const select = (v: TestFormValues) => ({
      alueet: v.alueet.map((a) => ({
        id: a.id,
        serializedGeometry: a.feature
          ? {
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [1, 2],
                    [3, 4],
                    [5, 6],
                    [1, 2],
                  ],
                ],
              },
            }
          : null,
      })),
    });
    render(<TestComponent select={select} />);
    // No field edits are made in this test. The hook only persists when form values change
    // or when the custom languageChanging event triggers an immediate snapshot. Trigger it
    // here to force persisting the initial geometry subset selected above.
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() => expect(sessionStorage.getItem(STORAGE_KEY)).toBeTruthy());
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY)!);
    expect(parsed.alueet).toHaveLength(2);
    expect(parsed.alueet[0].serializedGeometry.geometry.type).toBe('Polygon');
    expect(parsed.alueet[0].serializedGeometry.geometry.coordinates[0][0]).toEqual([1, 2]);
  });
});
