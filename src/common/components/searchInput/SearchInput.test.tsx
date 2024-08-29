import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextInput } from 'hds-react';
import yup from '../../utils/yup';
import SearchInput from './SearchInput';
import { render, act, screen } from '../../../testUtils/render';

const validationSchema = yup.object({ testField: yup.string().required() });

function TestComponent() {
  const methods = useForm({
    defaultValues: { testField: '' },
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  return (
    <FormProvider {...methods}>
      <SearchInput id="test-field" name="testField" label="Test field" onSubmit={() => {}} />
      <TextInput id="other-field" label="Other field" />
    </FormProvider>
  );
}

test('Should show error message when input is invalid', async () => {
  render(<TestComponent />);
  await act(async () => {
    screen.getByRole('combobox', { name: /test field/i }).focus();
    screen.getByLabelText('Other field').focus();
  });

  expect(screen.getByText('Kenttä on pakollinen')).toBeInTheDocument();
});
