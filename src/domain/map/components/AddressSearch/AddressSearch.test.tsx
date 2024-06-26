import { render, screen, waitFor } from '../../../../testUtils/render';
import AddressSearch from './AddressSearch';

jest.setTimeout(30000);

test('Address can be selected from suggestions', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  await user.type(searchInput, 'elielinaukio');

  await waitFor(() => expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument(), {
    timeout: 30000,
  });
  await user.click(screen.getByText('Elielinaukio 3'));

  expect(handleAddressSelect).toHaveBeenCalledWith([25496700, 6673224]);
});

test('Swedish address labels are returned when search term is in Swedish', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  user.type(searchInput, 'elielplatsen');

  await waitFor(() => expect(screen.getByText('Elielplatsen 1')).toBeInTheDocument(), {
    timeout: 30000,
  });

  expect(screen.getByText('Elielplatsen 2')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 3')).toBeInTheDocument();
  expect(screen.getByText('Elielplatsen 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is in Finnish', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  user.type(searchInput, 'elielinaukio');

  await waitFor(() => expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument(), {
    timeout: 30000,
  });

  expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is incomplete and can be either Finnish or Swedish', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  user.type(searchInput, 'eliel');

  await waitFor(() => screen.getByText('Elielinaukio 1'));

  expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});

test('Finnish address labels are returned when search term is in Finnish and has trailing white space', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  user.type(searchInput, 'elielinaukio ');

  await waitFor(() => expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument(), {
    timeout: 30000,
  });

  expect(screen.getByText('Elielinaukio 1')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 2')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument();
  expect(screen.getByText('Elielinaukio 5')).toBeInTheDocument();
});

test('Finnish address label is returned when search term is in Finnish and has street number after street name', async () => {
  const handleAddressSelect = jest.fn();
  const { user } = render(<AddressSearch onAddressSelect={handleAddressSelect} />);

  const searchInput = screen.getByPlaceholderText('Etsi osoitteella');
  user.type(searchInput, 'Elielinaukio 3');

  await waitFor(() => expect(screen.getByText('Elielinaukio 3')).toBeInTheDocument(), {
    timeout: 30000,
  });
});
