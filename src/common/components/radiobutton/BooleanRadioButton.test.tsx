import { FormProvider, useForm } from 'react-hook-form';
import { SelectionGroup } from 'hds-react';
import { render, screen } from '../../../testUtils/render';
import BooleanRadioButton from './BooleanRadioButton';
import { waitFor } from '@testing-library/react';

function TestComponent() {
  const formContext = useForm({ defaultValues: { selection: false } });

  return (
    <FormProvider {...formContext}>
      <SelectionGroup label="Test selection">
        <BooleanRadioButton name="selection" label="Yes" id="yes" value />
        <BooleanRadioButton name="selection" label="No" id="no" value={false} />
      </SelectionGroup>
    </FormProvider>
  );
}

test('Boolean choice works as expected', async () => {
  const { user } = render(<TestComponent />);

  expect(screen.getByLabelText('No')).toBeChecked();

  await user.click(screen.getByLabelText('Yes'));
  await waitFor(() => expect(screen.getByLabelText('Yes')).toBeChecked());

  await user.click(screen.getByLabelText('No'));
  await waitFor(() => expect(screen.getByLabelText('No')).toBeChecked());
});
