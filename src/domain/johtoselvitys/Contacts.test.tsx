import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '../../testUtils/render';
import Contacts from '../application/components/ApplicationContacts';
import { JohtoselvitysFormValues } from './types';

function Form({ application }: { application?: JohtoselvitysFormValues }) {
  const methods = useForm({ defaultValues: application ?? { applicationData: {} } });

  return (
    <FormProvider {...methods}>
      <Contacts hankeTunnus={null} />
    </FormProvider>
  );
}

test('Business id field is disabled if customer type is not company or association', async () => {
  const { user } = render(<Form />);

  await user.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
  await user.click(screen.getAllByText(/yksityishenkilö/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeDisabled();

  await user.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
  await user.click(screen.getAllByText(/muu/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeDisabled();
});

test('Business id field is not disabled if customer type is company', async () => {
  const { user } = render(<Form />);

  await user.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
  await user.click(screen.getAllByText(/yritys/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeEnabled();
});

test('Business id field is not disabled if customer type is association', async () => {
  const { user } = render(<Form />);

  await user.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
  await user.click(screen.getAllByText(/yhdistys/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeEnabled();
});
