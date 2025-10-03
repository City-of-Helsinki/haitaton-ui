import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '../../../testUtils/render';
import DatePicker from './DatePicker';
import userEvent from '@testing-library/user-event';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Form: React.FC<React.PropsWithChildren<{ defaultValues: any }>> = ({
  children,
  defaultValues,
}) => {
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  );
};

test('Value should be empty when default value is null', () => {
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker name="dateInput" label="Date input" locale="fi" />
    </Form>,
  );

  expect(screen.getByLabelText('Date input', { exact: false })).toHaveValue('');
});

test('Value should be default value when it is given', () => {
  const defaultValues = { dateInput: '2023-11-06T00:00:00Z' };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker name="dateInput" label="Date input" locale="fi" />
    </Form>,
  );

  expect(screen.getByLabelText('Date input', { exact: false })).toHaveValue('6.11.2023');
});

test('Shows error when date is invalid', async () => {
  const user = userEvent.setup();
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker name="dateInput" label="Date input" locale="fi" />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '32.13.2025'); // Ei ole validi päivämäärä
  await user.tab();

  expect(screen.getByText(/Kentän arvo on virheellinen/i)).toBeInTheDocument();
});

test('Shows error when date is before hankeStartDate', async () => {
  const user = userEvent.setup();
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker
        name="dateInput"
        label="Date input"
        locale="fi"
        hankeStartDate={new Date('2025-06-01')}
      />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '31.05.2025');
  await user.tab();

  expect(screen.getByText(/Päivämäärä ei voi olla ennen hankkeen alkamista/i)).toBeInTheDocument();
});
test('Shows error when date is after hankeEndDate', async () => {
  const user = userEvent.setup();
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker
        name="dateInput"
        label="Date input"
        locale="fi"
        hankeEndDate={new Date('2025-10-01')}
      />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '02.10.2025');
  await user.tab();

  expect(screen.getByText(/Päivämäärä ei voi olla hankkeen loppumisen jälkeen/i)).toBeInTheDocument();
});

test('Date equal to hankeStartDate is accepted', async () => {
  const user = userEvent.setup();
  const defaultValues = { dateInput: null };
  const hankeStartDate = new Date('2025-06-01');

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker
        name="dateInput"
        label="Date input"
        locale="fi"
        hankeStartDate={hankeStartDate}
      />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '1.6.2025');
  await user.tab();

  expect(screen.queryByText(/Päivämäärä ei voi olla ennen hankkeen alkamista/i)).not.toBeInTheDocument();
});

test('Date equal to hankeEndDate is accepted', async () => {
  const user = userEvent.setup();
  const defaultValues = { dateInput: null };
  const hankeEndDate = new Date('2025-10-03');

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker
        name="dateInput"
        label="Date input"
        locale="fi"
        hankeEndDate={hankeEndDate}
      />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '3.10.2025');
  await user.tab();

  expect(screen.queryByText(/Päivämäärä ei voi olla hankkeen loppumisen jälkeen/i)).not.toBeInTheDocument();
});

test('Invalid date triggers manual error on blur', async () => {
  const user = userEvent.setup();
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker name="dateInput" label="Date input" locale="fi" />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, 'invalid-date');
  await user.tab();

  expect(screen.getByText(/Kentän arvo on virheellinen/i)).toBeInTheDocument();
});

test('Date equal to hankeStartDate is accepted on blur', async () => {
  const user = userEvent.setup();
  const hankeStartDate = new Date('2025-06-01');
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker
        name="dateInput"
        label="Date input"
        locale="fi"
        hankeStartDate={hankeStartDate}
      />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '1.6.2025');
  await user.tab();

  expect(screen.queryByText(/ennen hankkeen alkamista/i)).not.toBeInTheDocument();
});

test('Date before hankeStartDate triggers notification error', async () => {
  const user = userEvent.setup();
  const hankeStartDate = new Date('2025-06-01');
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker
        name="dateInput"
        label="Date input"
        locale="fi"
        hankeStartDate={hankeStartDate}
      />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '31.5.2025');
  await user.tab();

  expect(screen.getByText(/ennen hankkeen alkamista/i)).toBeInTheDocument();
});

test('Date equal to hankeEndDate is accepted on blur', async () => {
  const user = userEvent.setup();
  const hankeEndDate = new Date('2025-10-03');
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker
        name="dateInput"
        label="Date input"
        locale="fi"
        hankeEndDate={hankeEndDate}
      />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '3.10.2025');
  await user.tab();

  expect(screen.queryByText(/hankkeen loppumisen jälkeen/i)).not.toBeInTheDocument();
});

test('Date after hankeEndDate triggers notification error', async () => {
  const user = userEvent.setup();
  const hankeEndDate = new Date('2025-10-03');
  const defaultValues = { dateInput: null };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker
        name="dateInput"
        label="Date input"
        locale="fi"
        hankeEndDate={hankeEndDate}
      />
    </Form>,
  );

  const input = screen.getByLabelText('Date input');
  await user.type(input, '4.10.2025');
  await user.tab();

  expect(screen.getByText(/hankkeen loppumisen jälkeen/i)).toBeInTheDocument();
});
