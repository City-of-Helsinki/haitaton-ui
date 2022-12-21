import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../../testUtils/render';
import AddressSearch from './AddressSearch';

test('Address can be selected from suggestions', async () => {
  const user = userEvent.setup();

  const handleAddressSelect = jest.fn();
  render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  await user.type(searchInput, 'elielinaukio');

  await waitFor(() => screen.getByText('Elielinaukio 3'));
  await userEvent.click(screen.getByText('Elielinaukio 3'));

  expect(handleAddressSelect).toHaveBeenCalledWith([25496700, 6673224]);
});

test('Swedish address labels are returned when search term is in Swedish', async () => {
  const handleAddressSelect = jest.fn();
  render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  userEvent.type(searchInput, 'elielplatsen');

  await waitFor(() => screen.getByText('Elielplatsen 1'));

  expect(screen.getByText('Elielplatsen 1')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 2')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 3')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is in Finnish', async () => {
  const handleAddressSelect = jest.fn();
  render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  userEvent.type(searchInput, 'elielinaukio');

  await waitFor(() => screen.getByText('Elielinaukio 1'));

  expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is incomplete and can be either Finnish or Swedish', async () => {
  const handleAddressSelect = jest.fn();
  render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  userEvent.type(searchInput, 'eliel');

  await waitFor(() => screen.getByText('Elielinaukio 1'));

  expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});
