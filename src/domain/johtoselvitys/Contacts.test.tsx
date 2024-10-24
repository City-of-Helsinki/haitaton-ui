import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, render, screen } from '../../testUtils/render';
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

test('Business id field is disabled if customer type is not company or association', () => {
  render(<Form />);

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yksityishenkilö/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeDisabled();

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/muu/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeDisabled();
});

test('Business id field is not disabled if customer type is company or association', () => {
  render(<Form />);

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yritys/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeEnabled();

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yhdistys/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeEnabled();
});
