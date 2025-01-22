import { UseFormGetValues } from 'react-hook-form';
import { ValidationError } from 'yup';
import { render, screen } from '@testing-library/react';
import { KaivuilmoitusFormValues } from './types';
import { t } from '../../locales/i18nForTests';
import { mapValidationErrorToErrorListItem } from './mapValidationErrorToErrorListItem';
import { ContactType } from '../application/types/application';

test('Should show error for simple error path, for example work description', () => {
  const error = new ValidationError('Test error', undefined, 'applicationData.workDescription');
  const getValues: UseFormGetValues<KaivuilmoitusFormValues> = jest.fn().mockReturnValue({});
  render(mapValidationErrorToErrorListItem(error, t, getValues));

  expect(screen.getByText('Työn kuvaus')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '#applicationData.workDescription');
});

test('Should show error for application area', () => {
  const error = new ValidationError('Test error', undefined, 'applicationData.areas[0].katuosoite');
  const getValues: UseFormGetValues<KaivuilmoitusFormValues> = jest
    .fn()
    .mockReturnValue('Test Area');
  render(mapValidationErrorToErrorListItem(error, t, getValues));

  expect(screen.getByText('Työalueet (Test Area): Katuosoite')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '#applicationData.areas.0.katuosoite');
});

test('Should show error when there are no areas', () => {
  const error = new ValidationError('Test error', undefined, 'applicationData.areas');
  const getValues: UseFormGetValues<KaivuilmoitusFormValues> = jest.fn().mockReturnValue({});
  render(mapValidationErrorToErrorListItem(error, t, getValues));

  expect(screen.getByText('Työalueen piirtäminen')).toBeInTheDocument();
});

test('Should show error for haittojenhallintasuunnitelma', () => {
  const error = new ValidationError(
    'Test error',
    undefined,
    'applicationData.areas[0].haittojenhallintasuunnitelma.YLEINEN',
  );
  const getValues: UseFormGetValues<KaivuilmoitusFormValues> = jest
    .fn()
    .mockReturnValue('Test Area');
  render(mapValidationErrorToErrorListItem(error, t, getValues));

  expect(
    screen.getByText('Työalueet (Test Area): Toimet työalueiden haittojen hallintaan'),
  ).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute(
    'href',
    '#applicationData.areas.0.haittojenhallintasuunnitelma.YLEINEN',
  );
});

test.each([
  [
    'applicationData.customerWithContacts.customer.registryKey',
    ContactType.COMPANY,
    'Työstä vastaava: Y-tunnus',
  ],
  [
    'applicationData.customerWithContacts.customer.registryKey',
    ContactType.ASSOCIATION,
    'Työstä vastaava: Y-tunnus',
  ],
  [
    'applicationData.customerWithContacts.customer.registryKey',
    ContactType.PERSON,
    'Työstä vastaava: Henkilötunnus',
  ],
  [
    'applicationData.customerWithContacts.customer.registryKey',
    ContactType.OTHER,
    'Työstä vastaava: Y-tunnus, henkilötunnus tai muu yksilöivä tunnus',
  ],
  [
    'applicationData.invoicingCustomer.registryKey',
    ContactType.COMPANY,
    'Laskutustiedot: Y-tunnus',
  ],
  [
    'applicationData.invoicingCustomer.registryKey',
    ContactType.ASSOCIATION,
    'Laskutustiedot: Y-tunnus',
  ],
  [
    'applicationData.invoicingCustomer.registryKey',
    ContactType.PERSON,
    'Laskutustiedot: Henkilötunnus',
  ],
  [
    'applicationData.invoicingCustomer.registryKey',
    ContactType.OTHER,
    'Laskutustiedot: Y-tunnus, henkilötunnus tai muu yksilöivä tunnus',
  ],
])(`Should show error for contact with path %s and type %s`, (path, contactType, errorMsg) => {
  const error = new ValidationError('Test error', undefined, path);
  const getValues: UseFormGetValues<KaivuilmoitusFormValues> = jest
    .fn()
    .mockReturnValue(contactType);
  render(mapValidationErrorToErrorListItem(error, t, getValues));

  expect(screen.getByText(errorMsg)).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', `#${path}`);
});

test.each([
  ['applicationData.startTime', 'Työn alkupäivämäärä'],
  ['applicationData.endTime', 'Työn loppupäivämäärä'],
])(`Should show error for date with path %s and text %s`, (path, errorMsg) => {
  const error = new ValidationError('Test error', undefined, path);
  const getValues: UseFormGetValues<KaivuilmoitusFormValues> = jest.fn().mockReturnValue({});
  render(mapValidationErrorToErrorListItem(error, t, getValues));

  expect(screen.getByText(errorMsg)).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', `#${path}`);
});
