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
  userEvent.click(screen.getByText('Elielinaukio 3'));
  expect(handleAddressSelect).toHaveBeenCalledWith([25496700, 6673224]);
});
