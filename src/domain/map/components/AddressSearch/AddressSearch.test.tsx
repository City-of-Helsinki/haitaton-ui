import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../testUtils/render';
import AddressSearch from './AddressSearch';
import { addressData } from '../../../mocks/helAddressData';

test('Address can be selected from suggestions', async () => {
  mockAxios.get.mockResolvedValueOnce({ data: addressData });

  const handleAddressSelect = jest.fn();
  render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');

  userEvent.type(searchInput, 'elielinaukio');
  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });
  await userEvent.click(screen.getByText('Elielinaukio 3'));
  expect(handleAddressSelect).toHaveBeenCalledWith([25496700, 6673224]);
});

test('Swedish address labels are returned when search term is in Swedish', async () => {
  mockAxios.get.mockResolvedValueOnce({ data: addressData });

  const handleAddressSelect = jest.fn();
  render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');

  userEvent.type(searchInput, 'elielplatsen');
  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });

  expect(screen.getByText('Elielplatsen 1')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 2')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 3')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is in Finnish', async () => {
  mockAxios.get.mockResolvedValueOnce({ data: addressData });

  const handleAddressSelect = jest.fn();
  render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');

  userEvent.type(searchInput, 'elielinaukio');
  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });

  expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is incomplete and can be either Finnish or Swedish', async () => {
  mockAxios.get.mockResolvedValueOnce({ data: addressData });

  const handleAddressSelect = jest.fn();
  render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');

  userEvent.type(searchInput, 'eliel');
  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });

  expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});
