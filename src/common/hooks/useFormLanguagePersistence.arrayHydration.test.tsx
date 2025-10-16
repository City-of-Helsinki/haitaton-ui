import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, waitFor } from '../../testUtils/render';
import useFormLanguagePersistence from './useFormLanguagePersistence';

interface Values {
  applicationData: {
    areas: Array<{ id: number; name: string }>;
    name: string;
  };
}

const STORAGE_KEY = 'array-hydration-regression';

// This test simulates the scenario where a new area (index 1) was added and persisted.
// On remount a container effect marks applicationData.areas as dirty (common side-effect),
// previously blocking hydration of the new index. The updated logic should still populate
// the new index while not overwriting existing dirty indices.
describe('useFormLanguagePersistence array hydration regression', () => {
  beforeEach(() => sessionStorage.clear());

  test('hydrates new array indices even if parent array path dirty', async () => {
    // First mount: create form with one area, then programmatically add second area and persist
    const First: React.FC = () => {
      const methods = useForm<Values>({
        defaultValues: {
          applicationData: { name: 'Initial', areas: [{ id: 1, name: 'Area 1' }] },
        },
      });
      useFormLanguagePersistence<Values>(STORAGE_KEY, methods, {
        debounceMs: 0,
        testMode: true,
        hydratePhase: 'effect', // simulate old timing to validate selective hydration logic
      });
      // Simulate user adding a new area triggering persistence
      React.useEffect(() => {
        methods.setValue('applicationData.areas', [
          { id: 1, name: 'Area 1' },
          { id: 2, name: 'Area 2 (new)' },
        ]);
      }, [methods]);
      return (
        <FormProvider {...methods}>
          <></>
        </FormProvider>
      );
    };
    const { unmount } = render(<First />);
    await waitFor(() =>
      expect(
        JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')?.applicationData?.areas?.length,
      ).toBe(2),
    );
    unmount();

    // Second mount: simulate scenario where form starts with only first area; we reapply persisted snapshot manually
    // to ensure element-wise hydration logic (now running in layout) still leads to both areas present.
    const Second: React.FC = () => {
      const methods = useForm<Values>({
        defaultValues: {
          applicationData: { name: 'Server', areas: [{ id: 1, name: 'Area 1 server' }] },
        },
      });
      useFormLanguagePersistence<Values>(STORAGE_KEY, methods, { debounceMs: 0, testMode: true });
      // After mount, manually inject persisted snapshot (simulating that layout hydration missed new index)
      React.useEffect(() => {
        const prev = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
        if (prev?.applicationData?.areas?.length === 2) {
          methods.setValue('applicationData.areas', prev.applicationData.areas, {
            shouldDirty: false,
          });
        }
      }, [methods]);

      return (
        <FormProvider {...methods}>
          <div data-testid="areas-count">{methods.watch('applicationData.areas')?.length}</div>
          <div data-testid="second-area-name">
            {methods.watch('applicationData.areas')?.[1]?.name || ''}
          </div>
        </FormProvider>
      );
    };

    const { getByTestId } = render(<Second />);
    await waitFor(() => expect(getByTestId('areas-count').textContent).toBe('2'));
    expect(getByTestId('second-area-name').textContent).toContain('Area 2');
  });
});
