import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, waitFor } from '../../testUtils/render';
import userEvent from '@testing-library/user-event';
import useAreasPersistence from '../../common/hooks/useAreasPersistence';

// mapToKaivuilmoitusArea throws in tests (no tyoalueet on test areas) — passthrough is sufficient
vi.mock('../../domain/kaivuilmoitus/utils', () => ({
  mapToKaivuilmoitusArea: (area: unknown) => area,
  mapToJohtoselvitysArea: (area: unknown) => area,
}));

interface FormValues {
  applicationData: {
    areas: Array<{ id?: number; name?: string }>;
    name?: string;
  };
}

const STORAGE_KEY = 'kaivu-areas-visibility-regression';

/**
 * TestWrapper owns the form and reads areas via methods.watch() in the render body.
 * A useEffect forces a re-render after useLayoutEffect hydration has applied persisted values,
 * ensuring the count reflects the hydrated state. setValue calls from useLayoutEffect do not
 * trigger watch() subscriptions reliably in React 18 / JSDOM (only useEffect-triggered
 * setValues do), so the forceUpdate ensures the count is read after hydration.
 */
function TestWrapper() {
  const methods = useForm<FormValues>({
    defaultValues: { applicationData: { name: 'Test', areas: [] } },
  });
  useAreasPersistence<FormValues>(STORAGE_KEY, methods, { type: 'KAIVU', extraSelect: (v) => v });
  // Force a re-render after useLayoutEffect hydration so watch() picks up persisted values
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    forceUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const areas = methods.watch('applicationData.areas') || [];
  const add = () => {
    const currentAreas = methods.getValues('applicationData.areas') || [];
    methods.setValue('applicationData.areas', [
      ...currentAreas,
      { id: currentAreas.length + 1, name: `Area ${currentAreas.length + 1}` },
    ]);
  };
  return (
    <FormProvider {...methods}>
      <div data-testid="areas-count">{areas.length}</div>
      <button onClick={add} type="button" data-testid="add-area">
        Add area
      </button>
    </FormProvider>
  );
}

describe('Kaivuilmoitus areas persistence visibility', () => {
  beforeEach(() => sessionStorage.clear());

  test('newly added area visible after simulated language change remount', async () => {
    const user = userEvent.setup();
    const { getByTestId, unmount } = render(<TestWrapper />);
    await user.click(getByTestId('add-area'));
    await waitFor(() => expect(getByTestId('areas-count').textContent).toBe('1'));
    // Force snapshot like language change event
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    expect(
      JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}').applicationData.areas.length,
    ).toBe(1);
    unmount();
    // Remount (language changed -> route remount)
    const { getByTestId: getByTestId2 } = render(<TestWrapper />);
    await waitFor(() => expect(getByTestId2('areas-count').textContent).toBe('1'));
  });

  test('deleted area does not reappear after remount', async () => {
    const user = userEvent.setup();
    const { getByTestId, unmount } = render(<TestWrapper />);
    // Add two areas
    await user.click(getByTestId('add-area'));
    await user.click(getByTestId('add-area'));
    await waitFor(() => expect(getByTestId('areas-count').textContent).toBe('2'));
    // Force snapshot
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    // Remove second area by updating form state (simulate user deletion logic)
    // We must remount with modified default values to mimic deletion before language change navigation
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.applicationData.areas.length).toBe(2);
    // Simulate deletion by altering persisted snapshot directly (language change would snapshot prior state)
    const afterDeletion = {
      applicationData: { ...stored.applicationData, areas: [{ id: 1, name: 'Area 1' }] },
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(afterDeletion));
    unmount();
    // Remount fresh wrapper (language changed)
    const { getByTestId: getByTestId2 } = render(<TestWrapper />);
    await waitFor(() => expect(getByTestId2('areas-count').textContent).toBe('1'));
  });
});
