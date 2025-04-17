import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '../../../testUtils/render';
import InputCombobox from './InputCombobox';

function TestComponent() {
  const methods = useForm({ defaultValues: { test: [] } });

  return (
    <FormProvider {...methods}>
      <InputCombobox id="test" name="test" label="Test combobox" options={['input1']} />
    </FormProvider>
  );
}

test('Should be able to add new option to the list', async () => {
  const newInput = 'input2';
  const { user } = render(<TestComponent />);
  await user.click(screen.getByRole('button', { name: /test combobox/i }));
  await user.type(screen.getByRole('combobox'), newInput);
  await user.keyboard('{Enter}');

  expect(screen.getAllByText(newInput)).toHaveLength(3);
});
