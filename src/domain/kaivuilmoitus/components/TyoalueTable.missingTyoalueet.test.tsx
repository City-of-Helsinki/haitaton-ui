import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render } from '../../../testUtils/render';
import TyoalueTable from './TyoalueTable';
import VectorSource from 'ol/source/Vector';

interface FormValues {
  applicationData: { areas: Array<Record<string, unknown>> };
}

// Minimal draw context mock (component expects context provider higher up). We can mock hook.
vi.mock('../../../common/components/map/modules/draw/useDrawContext', () => ({
  default: () => ({
    state: { selectedFeature: null },
    actions: { setSelectedFeature: () => undefined },
  }),
}));

describe('TyoalueTable missing tyoalueet safety', () => {
  test('renders with area lacking tyoalueet without crashing', () => {
    const drawSource = new VectorSource();
    function Wrapper() {
      const methods = useForm<FormValues>({
        defaultValues: { applicationData: { areas: [{ id: 1, name: 'Area 1' }] } },
      });
      return (
        <FormProvider {...methods}>
          <TyoalueTable
            alueIndex={0}
            drawSource={drawSource}
            hankeAlueName="Hanke"
            johtoselvitykset={[]}
            onRemoveArea={() => undefined}
            onRemoveLastArea={() => undefined}
          />
        </FormProvider>
      );
    }
    const { container } = render(<Wrapper />);
    expect(container.firstChild).toBeTruthy();
  });
});
