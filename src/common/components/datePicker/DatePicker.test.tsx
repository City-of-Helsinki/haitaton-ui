import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '../../../testUtils/render';
import DatePicker from './DatePicker';

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
    </Form>
  );

  expect(screen.getByLabelText('Date input', { exact: false })).toHaveValue('');
});

test('Value should be default value when it is given', () => {
  const defaultValues = { dateInput: '2023-11-06T00:00:00Z' };

  render(
    <Form defaultValues={defaultValues}>
      <DatePicker name="dateInput" label="Date input" locale="fi" />
    </Form>
  );

  expect(screen.getByLabelText('Date input', { exact: false })).toHaveValue('6.11.2023');
});
